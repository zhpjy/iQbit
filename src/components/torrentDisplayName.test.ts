import { formatTorrentDisplayName } from "./torrentDisplayName";

describe("formatTorrentDisplayName", () => {
  it("replaces embedded line breaks with single spaces", () => {
    expect(
      formatTorrentDisplayName(
        "[唐诡奇谭]\r\nStrange.Tales.\nof.Tang.Dynasty.2025"
      )
    ).toBe("[唐诡奇谭] Strange.Tales. of.Tang.Dynasty.2025");
  });

  it("collapses surrounding whitespace created by line breaks", () => {
    expect(formatTorrentDisplayName("foo \n \r\n bar")).toBe("foo bar");
  });
});
