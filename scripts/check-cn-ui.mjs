import { readFileSync } from "node:fs";

const checks = [
  [
    "src/components/Auth.tsx",
    ["Please Sign In", "Username", "Password", "Sign In"],
  ],
  ["src/Pages.tsx", ["Downloads", "Search", "Trending", "Settings"]],
  [
    "src/pages/SettingsPage.tsx",
    ["Back", "Settings", "Search Plugins", "Font Size"],
  ],
  ["src/layout/default.tsx", ["Log Out"]],
];

const failures = [];

for (const [file, phrases] of checks) {
  const content = readFileSync(file, "utf8");
  for (const phrase of phrases) {
    if (content.includes(phrase)) {
      failures.push(`${file}: ${phrase}`);
    }
  }
}

if (failures.length) {
  console.error("Found untranslated UI copy:");
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log("cn-ui-check: ok");
