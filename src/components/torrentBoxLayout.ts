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
    size: "lg" as const,
    textAlign: "left" as const,
  },
});
