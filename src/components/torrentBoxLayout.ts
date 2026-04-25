const TORRENT_LIST_BASE_ROW_HEIGHT = 230;

export const getTorrentTitleLayoutProps = () => ({
  container: {
    alignItems: "center" as const,
    gap: 2,
    minW: 0,
    width: "100%",
  },
  title: {
    cursor: "pointer" as const,
    flex: 1,
    minW: 0,
    noOfLines: 2,
    overflowWrap: "anywhere" as const,
    size: "md" as const,
    textAlign: "left" as const,
    wordBreak: "keep-all" as const,
  },
});

export const getTorrentCardContainerProps = () => ({
  mb: 1,
  px: 4,
  py: 3,
  rounded: "xl" as const,
});

export const getTorrentListRowHeight = (scale: number) =>
  (TORRENT_LIST_BASE_ROW_HEIGHT * scale) / 100;
