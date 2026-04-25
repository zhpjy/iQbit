export const formatTorrentDisplayName = (name: string) =>
  name.replace(/\s*[\r\n]+\s*/g, " ").trim();
