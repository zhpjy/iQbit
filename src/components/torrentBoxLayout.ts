const TORRENT_LIST_BASE_ROW_HEIGHT = 248;

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
    size: "md" as const,
    textAlign: "left" as const,
  },
});

export const getTorrentCardContainerProps = () => ({
  mb: 4,
  px: 4,
  py: 3,
  rounded: "xl" as const,
});

export const getTorrentListRowHeight = (scale: number) =>
  (TORRENT_LIST_BASE_ROW_HEIGHT * scale) / 100;
