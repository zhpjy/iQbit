# iQbit 全量中文汉化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成前端所有用户可见文案的中文化，并通过稳定 key 与集中式文案层避免汉化改坏导航、设置和业务逻辑。

**Architecture:** 新增轻量中文文案模块集中管理用户可见文案；对导航页签、设置页入口和筛选项等“内部值与显示值混用”的结构，先拆成稳定 key 与中文显示文本，再逐步替换页面、组件和设置页中的散落英文字符串。验证以残留英文扫描和前端构建通过为主。

**Tech Stack:** React 18, TypeScript, Chakra UI, Vite, ripgrep, Node.js

---

### Task 1: 建立文案层与稳定 key 骨架

**Files:**
- Create: `src/locales/zh-CN.ts`
- Create: `scripts/check-cn-ui.mjs`
- Modify: `src/Pages.tsx`
- Modify: `src/layout/default.tsx`
- Modify: `src/pages/SettingsPage.tsx`
- Modify: `src/pages/TabSelectorPage.tsx`
- Modify: `src/components/Auth.tsx`
- Modify: `src/components/PageHeader.tsx`

- [ ] **Step 1: 写残留英文扫描脚本，先让检查失败**

```js
// scripts/check-cn-ui.mjs
import { readFileSync } from "node:fs";

const checks = [
  ["src/components/Auth.tsx", ["Please Sign In", "Username", "Password", "Sign In"]],
  ["src/Pages.tsx", ["Downloads", "Search", "Trending", "Settings"]],
  ["src/pages/SettingsPage.tsx", ["Back", "Settings", "Search Plugins", "Font Size"]],
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
```

- [ ] **Step 2: 运行扫描脚本，确认基线确实失败**

Run: `node scripts/check-cn-ui.mjs`
Expected: FAIL，并至少输出 `src/components/Auth.tsx: Please Sign In`、`src/Pages.tsx: Downloads`

- [ ] **Step 3: 新增中文文案模块**

```ts
// src/locales/zh-CN.ts
export const zhCN = {
  nav: {
    downloads: "下载",
    search: "搜索",
    trending: "热门",
    categories: "分类",
    fontSize: "字体大小",
    settings: "设置",
    searchPlugins: "搜索插件",
    tabSelector: "底部标签",
    logout: "退出登录",
  },
  auth: {
    title: "请登录",
    username: "用户名",
    password: "密码",
    signIn: "登录",
    unauthorized: "登录未授权",
  },
  common: {
    back: "返回",
    add: "添加",
    save: "保存",
    reset: "重置",
    saveChanges: "保存更改",
  },
  settings: {
    title: "设置",
    qbtGroup: "qBittorrent 设置",
    otherGroup: "其他设置",
    updates: "iQbit 更新",
    integrations: "集成",
  },
} as const;
```

- [ ] **Step 4: 把页面配置从英文显示标签改成稳定 key + 中文标题**

```ts
// src/Pages.tsx
export type PageId =
  | "downloads"
  | "search"
  | "trending"
  | "categories"
  | "fontSize"
  | "settings"
  | "searchPlugins"
  | "tabSelector";

type PageObject = {
  id: PageId;
  title: string;
  url: string;
  component: ReactNode;
  Icon: { active: (props: any) => ReactElement; inactive: (props: any) => ReactElement };
  visibleOn: PageNames[];
  layout?: (props: any) => ReactNode;
};

export const Pages: PageObject[] = [
  {
    id: "downloads",
    title: zhCN.nav.downloads,
    url: "/",
    component: <Home />,
    Icon: {
      active: (props) => <IoDownload {...props} />,
      inactive: (props) => <IoDownloadOutline {...props} />,
    },
    visibleOn: ["bottomNav"],
  },
  {
    id: "search",
    title: zhCN.nav.search,
    url: "/search",
    component: <SearchPage />,
    Icon: {
      active: (props) => <IoSearch {...props} />,
      inactive: (props) => <IoSearchOutline {...props} />,
    },
    visibleOn: ["bottomNav", "sideNav", "tabSelector"],
  },
];
```

- [ ] **Step 5: 同步改导航和设置页对页面/设置项的查找方式**

```ts
// src/layout/default.tsx
const middleTab = tabsSelected[0] || "trending";
const rightTab = tabsSelected[1] || "search";

const DownloadsPage = Pages.find((page) => page.id === "downloads")!;
const SettingsPage = Pages.find((page) => page.id === "settings")!;
const MiddleTab = Pages.find((page) => page.id === middleTab)!;
const RightTab = Pages.find((page) => page.id === rightTab)!;
```

```ts
// src/pages/SettingsPage.tsx
type SettingsPageId =
  | "download"
  | "connection"
  | "speed"
  | "bitTorrent"
  | "rss"
  | "webUi"
  | "advanced"
  | "updates"
  | "searchPlugins"
  | "categories"
  | "fontSize"
  | "mobileTabs"
  | "integrations";
```

- [ ] **Step 6: 把登录和页头通用文案接到文案模块**

```tsx
// src/components/Auth.tsx
<Heading size={"sm"}>{zhCN.auth.title}</Heading>
<IosInput label={zhCN.auth.username} labelWidth={105} first value={username} onChange={setUsername} />
<IosInput label={zhCN.auth.password} password labelWidth={105} last value={password} onChange={setPassword} />
<Button width={"100%"} colorScheme={"blue"} variant={"ghost"} mt={20} type={"submit"}>
  {zhCN.auth.signIn}
</Button>
```

```tsx
// src/components/PageHeader.tsx
{props.onBackButtonPress && (
  <Button variant={"ghost"} onClick={props.onBackButtonPress} width={12} h={12} p={1}>
    {zhCN.common.back}
  </Button>
)}
```

- [ ] **Step 7: 重新运行扫描脚本，确认第一批入口文案通过**

Run: `node scripts/check-cn-ui.mjs`
Expected: PASS，输出 `cn-ui-check: ok`

- [ ] **Step 8: 提交第一批骨架改动**

```bash
git add scripts/check-cn-ui.mjs src/locales/zh-CN.ts src/Pages.tsx src/layout/default.tsx src/pages/SettingsPage.tsx src/pages/TabSelectorPage.tsx src/components/Auth.tsx src/components/PageHeader.tsx
git commit -m "feat: add chinese ui copy foundation"
```

### Task 2: 完成主流程页面与共享组件汉化

**Files:**
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/CategoriesPage.tsx`
- Modify: `src/pages/FontSizeSelection.tsx`
- Modify: `src/components/Filters.tsx`
- Modify: `src/components/CategorySelect.tsx`
- Modify: `src/components/TorrentBox.tsx`
- Modify: `src/components/TorrentDownloadBox.tsx`
- Modify: `src/components/TorrentInformationContent.tsx`
- Modify: `src/components/settings/SaveAndResetButtons.tsx`
- Modify: `src/utils/StateDictionary.tsx`
- Modify: `src/locales/zh-CN.ts`

- [ ] **Step 1: 扩展文案模块，补齐下载页与通用操作文案**

```ts
// src/locales/zh-CN.ts
home: {
  title: "下载",
  addTorrent: "添加种子",
  magnetUrl: "磁力链接 / 地址",
  addTorrentFile: "通过 .torrent 文件添加",
  clear: "清空",
  dropIt: "松手即可上传",
  clickOrDrag: "点击或拖拽到此处",
  selectCategory: "选择分类",
  search: "搜索",
  showAll: "全部显示",
  oneOrMoreFilesInvalid: "一个或多个文件不是 .torrent 文件",
},
torrentActions: {
  removeTorrent: "删除种子",
  changeCategory: "更改分类",
  firstAndLastPiece: "优先首尾文件块",
  autoManagement: "自动管理",
  renameTorrent: "重命名种子",
  torrentInfo: "种子信息",
  deleteFiles: "删除文件",
  removeTorrentOnly: "仅移除种子",
},
```

- [ ] **Step 2: 先让下载页英文残留检查失败**

Run: `rg -n 'Add Torrent|Show All|Remove Torrent|Torrent Information|Save Changes' src/pages/Home.tsx src/components/TorrentBox.tsx src/components/TorrentInformationContent.tsx src/components/settings/SaveAndResetButtons.tsx`
Expected: FAIL，输出至少 1 条匹配

- [ ] **Step 3: 替换下载页、分类页、字体大小页与共享组件文案**

```tsx
// src/pages/Home.tsx
<PageHeader title={zhCN.home.title} buttonLabel={zhCN.home.addTorrent} onAddButtonClick={addModalDisclosure.onOpen} />
<IosBottomSheet title={zhCN.home.addTorrent} disclosure={addModalDisclosure}>
  <FormLabel>{zhCN.home.magnetUrl}</FormLabel>
  <FormLabel mb={0}>{zhCN.home.addTorrentFile}</FormLabel>
  <Button onClick={() => setFiles([])}>{zhCN.home.clear}</Button>
</IosBottomSheet>
```

```tsx
// src/components/settings/SaveAndResetButtons.tsx
<Button width={"100%"} size={"lg"} bgColor={"gray.500"} onClick={reset}>
  {zhCN.common.reset}
</Button>
<Button width={"100%"} colorScheme={"blue"} size={"lg"} onClick={saveSettings}>
  {zhCN.common.saveChanges}
</Button>
```

```tsx
// src/components/CategorySelect.tsx
{ label: zhCN.categories.noCategory, onClick: () => onSelected("") }
```

- [ ] **Step 4: 把状态字典改成“内部值保留、显示文本中文化”**

```ts
// src/utils/StateDictionary.tsx
error: {
  long: "发生错误，通常对应已暂停的种子",
  short: "错误",
},
pausedDL: {
  long: "种子已暂停，且尚未完成下载",
  short: "已暂停",
},
downloading: {
  long: "种子正在下载，数据传输中",
  short: "下载中",
},
```

- [ ] **Step 5: 重新检查主流程英文残留**

Run: `rg -n 'Add Torrent|Show All|Remove Torrent|Torrent Information|Save Changes' src/pages/Home.tsx src/pages/CategoriesPage.tsx src/pages/FontSizeSelection.tsx src/components/TorrentBox.tsx src/components/TorrentInformationContent.tsx src/components/settings/SaveAndResetButtons.tsx src/utils/StateDictionary.tsx`
Expected: 无输出

- [ ] **Step 6: 提交主流程页面汉化**

```bash
git add src/pages/Home.tsx src/pages/CategoriesPage.tsx src/pages/FontSizeSelection.tsx src/components/Filters.tsx src/components/CategorySelect.tsx src/components/TorrentBox.tsx src/components/TorrentDownloadBox.tsx src/components/TorrentInformationContent.tsx src/components/settings/SaveAndResetButtons.tsx src/utils/StateDictionary.tsx src/locales/zh-CN.ts
git commit -m "feat: translate core torrent workflow to chinese"
```

### Task 3: 完成搜索、趋势、插件、集成与标签页汉化

**Files:**
- Modify: `src/pages/SearchPage.tsx`
- Modify: `src/pages/TrendingPage.tsx`
- Modify: `src/pages/SearchPluginsPage.tsx`
- Modify: `src/pages/IntegrationsPage.tsx`
- Modify: `src/pages/TabSelectorPage.tsx`
- Modify: `src/searchAPIs/PluginSearch.tsx`
- Modify: `src/searchAPIs/yts.tsx`
- Modify: `src/searchAPIs/rarbg.tsx`
- Modify: `src/searchAPIs/tpb.tsx`
- Modify: `src/components/ios/IosSearch.tsx`
- Modify: `src/locales/zh-CN.ts`

- [ ] **Step 1: 扩展搜索与趋势相关文案**

```ts
// src/locales/zh-CN.ts
search: {
  title: "搜索",
  selectProvider: "选择搜索源",
  results: "结果",
  description: "简介",
  info: "信息",
  ratings: "评分",
  runtime: "片长",
  language: "语言",
  genres: "类型",
  trailer: "预告片",
  readMore: "展开",
  readLess: "收起",
  searchInProgress: "搜索进行中",
  updatePlugins: "更新搜索插件",
},
trending: {
  title: "热门",
  subtitle: "来自 TMDB 的热门影视",
  movies: "电影",
  tv: "剧集",
  top100: "TOP 100",
  downloadFromYts: "从 YTS 下载",
  searchTorrent: "搜索资源",
},
integrations: {
  sonarrUrl: "Sonarr 地址",
  sonarrApiKey: "Sonarr API Key",
  radarrUrl: "Radarr 地址",
  radarrApiKey: "Radarr API Key",
},
```

- [ ] **Step 2: 先确认这些页面当前确实还有英文**

Run: `rg -n 'Search|Trending|Description|Read More|Add Plugin|Confirm Uninstall|Your Sonarr API Key|Position 1|Position 2' src/pages/SearchPage.tsx src/pages/TrendingPage.tsx src/pages/SearchPluginsPage.tsx src/pages/IntegrationsPage.tsx src/pages/TabSelectorPage.tsx src/searchAPIs src/components/ios/IosSearch.tsx`
Expected: FAIL，输出多条英文命中

- [ ] **Step 3: 替换这些页面与搜索组件中的用户可见文案**

```tsx
// src/pages/SearchPage.tsx
<PageHeader title={zhCN.search.title} />
<Heading size={"sm"}>{zhCN.search.selectProvider}</Heading>
```

```tsx
// src/searchAPIs/yts.tsx
<SectionSM title={zhCN.search.description}>
  <Button variant={"link"} onClick={toggleExpandedDescription}>
    {expandedDescription ? zhCN.search.readLess : zhCN.search.readMore}
  </Button>
</SectionSM>
```

```tsx
// src/pages/SearchPluginsPage.tsx
{ label: zhCN.plugins.confirmUninstall, onClick: uninstall, danger: true }
```

```tsx
// src/pages/TabSelectorPage.tsx
<option value={0}>位置 1</option>
<option value={1}>位置 2</option>
```

- [ ] **Step 4: 重新检查搜索与趋势页面残留英文**

Run: `rg -n 'Read More|Read Less|Confirm Uninstall|Add Plugin|Position 1|Position 2|Trending Movies and Shows from TMDB' src/pages/SearchPage.tsx src/pages/TrendingPage.tsx src/pages/SearchPluginsPage.tsx src/pages/IntegrationsPage.tsx src/pages/TabSelectorPage.tsx src/searchAPIs src/components/ios/IosSearch.tsx`
Expected: 无输出

- [ ] **Step 5: 提交搜索与集成页汉化**

```bash
git add src/pages/SearchPage.tsx src/pages/TrendingPage.tsx src/pages/SearchPluginsPage.tsx src/pages/IntegrationsPage.tsx src/pages/TabSelectorPage.tsx src/searchAPIs/PluginSearch.tsx src/searchAPIs/yts.tsx src/searchAPIs/rarbg.tsx src/searchAPIs/tpb.tsx src/components/ios/IosSearch.tsx src/locales/zh-CN.ts
git commit -m "feat: translate discovery and integrations pages"
```

### Task 4: 完成设置页全量中文化

**Files:**
- Modify: `src/pages/SettingsPage.tsx`
- Modify: `src/components/settings/AllAnnouncements.tsx`
- Modify: `src/components/settings/RequestMoreSettings.tsx`
- Modify: `src/components/settings/Downloads/DownloadsPage.tsx`
- Modify: `src/components/settings/Downloads/SavingManagement.tsx`
- Modify: `src/components/settings/Downloads/WhenAddingTorrent.tsx`
- Modify: `src/components/settings/Connection/ConnectionPage.tsx`
- Modify: `src/components/settings/Connection/ConnectionLimits.tsx`
- Modify: `src/components/settings/Connection/IP Filtering.tsx`
- Modify: `src/components/settings/Connection/ProxyServer.tsx`
- Modify: `src/components/settings/Speed/SpeedPage.tsx`
- Modify: `src/components/settings/Speed/GlobalRateLimits.tsx`
- Modify: `src/components/settings/Speed/AlternativeRateLimits.tsx`
- Modify: `src/components/settings/Speed/RateLimitingSettings.tsx`
- Modify: `src/components/settings/WebUI/Language.tsx`
- Modify: `src/components/settings/WebUI/WebUIPage.tsx`
- Modify: `src/locales/zh-CN.ts`

- [ ] **Step 1: 扩展设置页文案与选项标签**

```ts
// src/locales/zh-CN.ts
settingsPages: {
  download: "下载",
  connection: "连接",
  speed: "速度",
  bitTorrent: "BitTorrent",
  rss: "RSS",
  webUi: "Web UI",
  advanced: "高级",
  updates: "iQbit 更新",
  searchPlugins: "搜索插件",
  categories: "分类",
  fontSize: "字体大小",
  mobileTabs: "底部标签",
  integrations: "集成",
},
settingsLabels: {
  globalRateLimits: "全局速率限制",
  alternativeRateLimits: "备用速率限制",
  connectionLimits: "连接限制",
  proxyServer: "代理服务器",
  language: "语言",
  userInterfaceLanguage: "界面语言",
  savePath: "默认保存路径",
}
```

- [ ] **Step 2: 先让设置页残留英文检查失败**

Run: `rg -n 'Global Rate Limits|Alternative Rate Limits|Connection Limits|Proxy Server|Language|Use HTTPS instead of HTTP|Save Changes|Reset|Need other settings from this page\\?' src/pages/SettingsPage.tsx src/components/settings`
Expected: FAIL，输出至少 5 条匹配

- [ ] **Step 3: 分批替换设置页分组名、字段名、helper text 与下拉选项**

```tsx
// src/components/settings/Connection/ProxyServer.tsx
const options: SettingsSelectOption[] = [
  { label: "无", value: TorrSettingsProxyType.none },
  { label: "SOCKS4（无认证）", value: TorrSettingsProxyType.socks4 },
  { label: "SOCKS5（无认证）", value: TorrSettingsProxyType.socks5 },
];
```

```tsx
// src/components/settings/WebUI/Language.tsx
<SettingsBox title={zhCN.settingsLabels.language}>
  <SettingsSelect
    label={zhCN.settingsLabels.userInterfaceLanguage}
    helperText={"对 iQbit 本身无影响"}
    settingKey={"locale"}
    options={options}
  />
</SettingsBox>
```

```tsx
// src/components/settings/RequestMoreSettings.tsx
<SettingsBox title={"还需要这个页面里的其他设置吗？"}>
  当前只暴露了常用设置项。如果你缺少某个设置，请使用下面的开关关闭此提示。
</SettingsBox>
```

- [ ] **Step 4: 重新检查设置页残留英文**

Run: `rg -n 'Global Rate Limits|Alternative Rate Limits|Connection Limits|Proxy Server|Need other settings from this page\\?|Use HTTPS instead of HTTP|Peer Connection Protocol|Enable Alternative Rate Limit Scheduler' src/pages/SettingsPage.tsx src/components/settings`
Expected: 无输出

- [ ] **Step 5: 提交设置页全量汉化**

```bash
git add src/pages/SettingsPage.tsx src/components/settings/AllAnnouncements.tsx src/components/settings/RequestMoreSettings.tsx src/components/settings/Downloads/DownloadsPage.tsx src/components/settings/Downloads/SavingManagement.tsx src/components/settings/Downloads/WhenAddingTorrent.tsx src/components/settings/Connection/ConnectionPage.tsx src/components/settings/Connection/ConnectionLimits.tsx src/components/settings/Connection/IP Filtering.tsx src/components/settings/Connection/ProxyServer.tsx src/components/settings/Speed/SpeedPage.tsx src/components/settings/Speed/GlobalRateLimits.tsx src/components/settings/Speed/AlternativeRateLimits.tsx src/components/settings/Speed/RateLimitingSettings.tsx src/components/settings/WebUI/Language.tsx src/components/settings/WebUI/WebUIPage.tsx src/locales/zh-CN.ts
git commit -m "feat: translate settings pages to chinese"
```

### Task 5: 全量验证与收尾

**Files:**
- Verify: `src/locales/zh-CN.ts`
- Verify: `src/Pages.tsx`
- Verify: `src/pages/*`
- Verify: `src/components/*`
- Verify: `src/components/settings/*`
- Verify: `src/searchAPIs/*`

- [ ] **Step 1: 运行全站残留英文扫描**

Run: `rg -n 'Please Sign In|Sign In|Log Out|Downloads|Search Plugins|Show All|Read More|Read Less|Add Plugin|Save Changes|Global Rate Limits|Proxy Server|Need other settings from this page\\?' src/pages src/components src/searchAPIs src/layout src/Pages.tsx`
Expected: 无输出

- [ ] **Step 2: 运行文案基线脚本**

Run: `node scripts/check-cn-ui.mjs`
Expected: 输出 `cn-ui-check: ok`

- [ ] **Step 3: 运行前端构建**

Run: `npm run build`
Expected: 构建成功，退出码为 0

- [ ] **Step 4: 检查最终差异**

Run: `git status --short`
Expected: 只包含本次中文汉化相关文件改动

- [ ] **Step 5: 提交最终收尾**

```bash
git add src/locales/zh-CN.ts scripts/check-cn-ui.mjs src/Pages.tsx src/layout/default.tsx src/pages src/components src/searchAPIs
git commit -m "feat: complete chinese localization"
```
