import { readFileSync } from "node:fs";

const checks = [
  {
    file: "src/components/Auth.tsx",
    patterns: [
      ["Please Sign In", />\s*Please Sign In\s*</],
      ["Username", /label=\{"Username"\}/],
      ["Password", /label=\{"Password"\}/],
      ["Sign In", />\s*Sign In\s*</],
    ],
  },
  {
    file: "src/Pages.tsx",
    patterns: [
      ["Downloads", /(?:title|label):\s*"Downloads"/],
      ["Search", /(?:title|label):\s*"Search"/],
      ["Trending", /(?:title|label):\s*"Trending"/],
      ["Settings", /(?:title|label):\s*"Settings"/],
    ],
  },
  {
    file: "src/pages/SettingsPage.tsx",
    patterns: [
      ["Back", />\s*Back\s*</],
      ["Settings", /title:\s*"Settings"|title=\{page \|\| "Settings"\}/],
      ["Search Plugins", /title:\s*"Search Plugins"/],
      ["Font Size", /title:\s*"Font Size"/],
    ],
  },
  {
    file: "src/layout/default.tsx",
    patterns: [["Log Out", />\s*Log Out\s*</]],
  },
];

const failures = [];

for (const { file, patterns } of checks) {
  const content = readFileSync(file, "utf8");
  for (const [label, pattern] of patterns) {
    if (pattern.test(content)) {
      failures.push(`${file}: ${label}`);
    }
  }
}

if (failures.length) {
  console.error("Found untranslated UI copy:");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("cn-ui-check: ok");
