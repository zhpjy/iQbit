import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { act } from "react-dom/test-utils";
import { createRoot, Root } from "react-dom/client";
import Home from "./Home";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

const mockUseMutation = jest.fn();
const mockUseQuery = jest.fn();
const mockUseLocalStorage = jest.fn();
const mockUseTernaryDarkMode = jest.fn();

jest.mock("react-query", () => ({
  useMutation: (...args: unknown[]) => mockUseMutation(...args),
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
}));

jest.mock("usehooks-ts", () => ({
  useLocalStorage: (...args: unknown[]) => mockUseLocalStorage(...args),
  useTernaryDarkMode: (...args: unknown[]) => mockUseTernaryDarkMode(...args),
}));

jest.mock("../components/PageHeader", () => () => null);
jest.mock("../components/TorrentBox", () => () => null);
jest.mock("../utils/TorrClient", () => ({
  TorrClient: {
    resumeAll: jest.fn(),
    pauseAll: jest.fn(),
    getCategories: jest.fn(),
    sync: jest.fn(),
    getSettings: jest.fn(),
    addTorrent: jest.fn(),
  },
}));
jest.mock("../components/ios/IosBottomSheet", () => ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
));
jest.mock("../components/Filters", () => ({
  FilterHeading: () => null,
}));
jest.mock("../utils/screenSize", () => ({
  useIsLargeScreen: () => true,
}));
jest.mock("../components/FontSizeProvider", () => ({
  useFontSizeContext: () => ({ scale: 100 }),
}));
jest.mock("../data", () => ({
  randomTorrent: {},
}));
jest.mock("react-virtualized", () => ({
  List: () => null,
  WindowScroller: ({ children }: { children: (props: any) => React.ReactNode }) =>
    children({ isScrolling: false, scrollTop: 0, width: 1200, height: 800 }),
}));

type CategoryMap = Record<string, { name: string }>;

describe("Home category filter migration", () => {
  let container: HTMLDivElement;
  let root: Root;
  let categoriesData: CategoryMap | undefined;
  let storage: Record<string, string>;
  let setters: Record<string, jest.Mock>;

  const mountRoot = () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  };

  const renderHome = async () => {
    await act(async () => {
      root.render(
        <ChakraProvider>
          <Home />
        </ChakraProvider>
      );
    });
  };

  beforeEach(() => {
    mountRoot();

    categoriesData = undefined;
    storage = {
      "home-filter-search": "",
      "home-filter-category": "all",
      "home-filter-status": "__all__",
    };
    setters = {};

    mockUseMutation.mockReturnValue({ mutate: jest.fn(), isLoading: false });
    mockUseTernaryDarkMode.mockReturnValue({ isDarkMode: false });
    mockUseLocalStorage.mockImplementation((key: string, initialValue: string) => {
      if (!(key in storage)) {
        storage[key] = initialValue;
      }

      if (!setters[key]) {
        setters[key] = jest.fn((value: string) => {
          storage[key] = value;
        });
      }

      return [storage[key], setters[key]];
    });
    mockUseQuery.mockImplementation((queryKey: string) => {
      if (queryKey === "torrentsCategory") {
        return { data: categoriesData };
      }

      if (queryKey === "torrentsTxData") {
        return { data: undefined, isLoading: false, isFetching: false };
      }

      if (queryKey === "settings-mainpage") {
        return { data: {} };
      }

      throw new Error(`Unexpected query key: ${queryKey}`);
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
    jest.clearAllMocks();
  });

  it("does not persist legacy Show All before categories are loaded", async () => {
    storage["home-filter-category"] = "Show All";

    await renderHome();

    expect(setters["home-filter-category"]).not.toHaveBeenCalled();
    expect(storage["home-filter-category"]).toBe("Show All");
  });

  it("migrates Show All to all after categories load when no category shares the name", async () => {
    storage["home-filter-category"] = "Show All";

    await renderHome();

    categoriesData = {
      movies: { name: "Movies" },
    };

    await renderHome();

    expect(storage["home-filter-category"]).toBe("all");
  });

  it("migrates Show All to category:Show All after categories load when that category exists", async () => {
    act(() => {
      root.unmount();
    });
    container.remove();

    mountRoot();
    categoriesData = undefined;
    storage["home-filter-category"] = "Show All";
    setters["home-filter-category"] = jest.fn((value: string) => {
      storage["home-filter-category"] = value;
    });

    await renderHome();

    categoriesData = {
      showAll: { name: "Show All" },
      movies: { name: "Movies" },
    };

    await renderHome();

    expect(storage["home-filter-category"]).toBe("category:Show All");
  });

  it("migrates __all__ to category:__all__ after categories load when that category exists", async () => {
    act(() => {
      root.unmount();
    });
    container.remove();

    mountRoot();
    categoriesData = undefined;
    storage["home-filter-category"] = "__all__";
    setters["home-filter-category"] = jest.fn((value: string) => {
      storage["home-filter-category"] = value;
    });

    await renderHome();

    categoriesData = {
      sentinel: { name: "__all__" },
      movies: { name: "Movies" },
    };

    await renderHome();

    expect(storage["home-filter-category"]).toBe("category:__all__");
  });
});
