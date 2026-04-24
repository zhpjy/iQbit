import { readFileSync } from "node:fs";

const checks = [
  {
    file: "src/components/Auth.tsx",
    forbiddenPatterns: [
      ["Please Sign In", />\s*Please Sign In\s*</],
      ["Username", /label=\{"Username"\}/],
      ["Password", /label=\{"Password"\}/],
      ["Sign In", />\s*Sign In\s*</],
    ],
  },
  {
    file: "src/Pages.tsx",
    forbiddenPatterns: [
      ["Downloads", /(?:title|label):\s*"Downloads"/],
      ["Search", /(?:title|label):\s*"Search"/],
      ["Trending", /(?:title|label):\s*"Trending"/],
      ["Settings", /(?:title|label):\s*"Settings"/],
    ],
  },
  {
    file: "src/pages/SettingsPage.tsx",
    forbiddenPatterns: [
      ["Back", />\s*Back\s*</],
      ["Settings", /title:\s*"Settings"|title=\{page \|\| "Settings"\}/],
      ["Search Plugins", /title:\s*"Search Plugins"/],
      ["Font Size", /title:\s*"Font Size"/],
    ],
  },
  {
    file: "src/layout/default.tsx",
    forbiddenPatterns: [["Log Out", />\s*Log Out\s*</]],
  },
  {
    file: "src/pages/TabSelectorPage.tsx",
    forbiddenPatterns: [
      ["Position 1", />\s*Position 1\s*</],
      ["Position 2", />\s*Position 2\s*</],
    ],
  },
  {
    file: "src/components/PageHeader.tsx",
    forbiddenPatterns: [["Back", /aria-label=\{"Back"\}|title=\{"Back"\}/]],
    requiredPatterns: [
      ["zhCN.common.back", /aria-label=\{zhCN\.common\.back\}/],
    ],
  },
];

const failures = [];

for (const { file, forbiddenPatterns = [], requiredPatterns = [] } of checks) {
  const content = readFileSync(file, "utf8");
  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(content)) {
      failures.push(`${file}: ${label}`);
    }
  }
  for (const [label, pattern] of requiredPatterns) {
    if (!pattern.test(content)) {
      failures.push(`${file}: missing ${label}`);
    }
  }
}

if (failures.length) {
  console.error("Found untranslated UI copy:");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("cn-ui-check: ok");
