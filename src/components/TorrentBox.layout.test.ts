import {
  getTorrentCardContainerProps,
  getTorrentListRowHeight,
  getTorrentTitleLayoutProps,
} from "./torrentBoxLayout";

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
        overflowWrap: "anywhere",
        size: "md",
        textAlign: "left",
        wordBreak: "keep-all",
      },
    });
  });
});

describe("getTorrentCardContainerProps", () => {
  it("keeps the card compact while preserving spacing between rows", () => {
    expect(getTorrentCardContainerProps()).toEqual({
      mb: 1,
      px: 4,
      py: 3,
      rounded: "xl",
    });
  });
});

describe("getTorrentListRowHeight", () => {
  it("scales the row height from a larger compact-card baseline", () => {
    expect(getTorrentListRowHeight(100)).toBe(230);
    expect(getTorrentListRowHeight(125)).toBe(287.5);
  });
});
