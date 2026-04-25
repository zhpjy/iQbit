import { getTorrentTitleLayoutProps } from "./torrentBoxLayout";

describe("getTorrentTitleLayoutProps", () => {
  it("keeps the title area flexible without collapsing to content width", () => {
    expect(getTorrentTitleLayoutProps()).toEqual({
      container: {
        alignItems: "center",
        gap: 2,
        minW: 0,
        width: "100%",
      },
      title: {
        cursor: "pointer",
        flex: 1,
        minW: 0,
        noOfLines: 2,
        size: "lg",
        textAlign: "left",
      },
    });
  });
});
