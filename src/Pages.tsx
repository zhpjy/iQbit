import React, { ReactElement, ReactNode } from "react";
import Home from "./pages/Home";
import {
  IoCog,
  IoCogOutline,
  IoDownload,
  IoDownloadOutline,
  IoExtensionPuzzle,
  IoExtensionPuzzleOutline,
  IoPricetags,
  IoPricetagsOutline,
  IoSearch,
  IoSearchOutline,
  IoText,
  IoTextOutline,
  IoTrendingUp,
  IoTrendingUpOutline,
} from "react-icons/io5";
import { zhCN } from "./locales/zh-CN";
import SearchPage from "./pages/SearchPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import SearchPluginsPage from "./pages/SearchPluginsPage";
import TrendingPage from "./pages/TrendingPage";
import FontSizeSelection from "./pages/FontSizeSelection";
import TabSelectorPage from "./pages/TabSelectorPage";

export type PageNames =
  | "sideNav"
  | "bottomNav"
  | "sideNavBottom"
  | "mobileSettingsList"
  | "tabSelector";

export type PageId =
  | "downloads"
  | "search"
  | "searchQuery"
  | "trending"
  | "categories"
  | "fontSize"
  | "settings"
  | "searchPlugins"
  | "tabSelector";

export type TabPageId = "search" | "trending" | "categories";

const pageIds: PageId[] = [
  "downloads",
  "search",
  "searchQuery",
  "trending",
  "categories",
  "fontSize",
  "settings",
  "searchPlugins",
  "tabSelector",
];

const tabPageIds: TabPageId[] = ["search", "trending", "categories"];

const pageIdSet = new Set<PageId>(pageIds);
const tabPageIdSet = new Set<TabPageId>(tabPageIds);

type PageObject = {
  id: PageId;
  title: string;
  url: string;
  component: ReactNode;
  Icon: {
    active: (props: any) => ReactElement;
    inactive: (props: any) => ReactElement;
  };
  visibleOn: PageNames[];
  layout?: (props: any) => ReactNode;
};

const legacyPageLabelToId: Record<string, PageId> = {
  Downloads: "downloads",
  Search: "search",
  Trending: "trending",
  Categories: "categories",
  "Font Size": "fontSize",
  Settings: "settings",
  "Search Plugins": "searchPlugins",
  "Tab Selector": "tabSelector",
};

export const normalizePageId = (
  value?: string | null
): PageId | undefined => {
  if (!value) {
    return undefined;
  }

  const normalizedValue = legacyPageLabelToId[value] ?? value;

  if (pageIdSet.has(normalizedValue as PageId)) {
    return normalizedValue as PageId;
  }

  return undefined;
};

export const normalizeTabPageId = (
  value?: string | null
): TabPageId | undefined => {
  const normalizedValue = normalizePageId(value);

  if (normalizedValue && tabPageIdSet.has(normalizedValue as TabPageId)) {
    return normalizedValue as TabPageId;
  }

  return undefined;
};

export const Pages: PageObject[] = [
  {
    id: "downloads",
    title: zhCN.nav.downloads,
    url: "/",
    component: <Home />,
    Icon: {
      active: (props) => <IoDownload {...props} />,
      inactive: (props) => <IoDownloadOutline {...props} />,
    },
    visibleOn: ["bottomNav"],
  },
  {
    id: "search",
    title: zhCN.nav.search,
    url: "/search",
    component: <SearchPage />,
    Icon: {
      active: (props) => <IoSearch {...props} />,
      inactive: (props) => <IoSearchOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
  },
  {
    id: "trending",
    title: zhCN.nav.trending,
    url: "/trending",
    component: <TrendingPage />,
    Icon: {
      active: (props) => <IoTrendingUp {...props} />,
      inactive: (props) => <IoTrendingUpOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
  },
  {
    id: "searchQuery",
    title: zhCN.nav.search,
    url: "/search/:query",
    component: <SearchPage />,
    Icon: {
      active: (props) => <IoSearch {...props} />,
      inactive: (props) => <IoSearchOutline {...props} />,
    },
    visibleOn: [],
  },
  {
    id: "categories",
    title: zhCN.nav.categories,
    url: "/categories",
    component: <CategoriesPage />,
    Icon: {
      active: (props) => <IoPricetags {...props} />,
      inactive: (props) => <IoPricetagsOutline {...props} />,
    },
    visibleOn: ["sideNavBottom", "mobileSettingsList", "tabSelector"],
  },
  {
    id: "fontSize",
    title: zhCN.nav.fontSize,
    url: "/font-size",
    component: <FontSizeSelection />,
    Icon: {
      active: (props) => <IoText {...props} />,
      inactive: (props) => <IoTextOutline {...props} />,
    },
    visibleOn: ["sideNavBottom"],
  },
  {
    id: "settings",
    title: zhCN.nav.settings,
    url: "/settings",
    component: <SettingsPage />,
    Icon: {
      active: (props) => <IoCog {...props} />,
      inactive: (props) => <IoCogOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNavBottom"],
  },
  {
    id: "searchPlugins",
    title: zhCN.nav.searchPlugins,
    url: "/plugins",
    component: <SearchPluginsPage />,
    Icon: {
      active: (props) => <IoExtensionPuzzle {...props} />,
      inactive: (props) => <IoExtensionPuzzleOutline {...props} />,
    },
    visibleOn: ["mobileSettingsList", "sideNav"],
  },
  {
    id: "tabSelector",
    title: zhCN.nav.tabSelector,
    url: "/tab-selector",
    component: <TabSelectorPage />,
    Icon: {
      active: (props) => <IoExtensionPuzzle {...props} />,
      inactive: (props) => <IoExtensionPuzzleOutline {...props} />,
    },
    visibleOn: ["mobileSettingsList"],
  },
];
