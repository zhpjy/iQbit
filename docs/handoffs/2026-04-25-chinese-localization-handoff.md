# 中文汉化交接文档

## 当前状态

- 当前分支：`master`
- 当前已提交基线：`24a9102`（`fix: localize search category labels`）
- 当前目标：继续完成“全量中文汉化”

## 已完成内容

### Task 1：文案层与稳定 key 骨架

已完成并通过审查，相关基础包括：

- 新增集中式文案层：[src/locales/zh-CN.ts](/home/zhpjy/project/proxy/iQbit/src/locales/zh-CN.ts)
- 新增英文残留检查脚本：[scripts/check-cn-ui.mjs](/home/zhpjy/project/proxy/iQbit/scripts/check-cn-ui.mjs)
- 页面稳定 id 与导航/设置页联动修复
- 登录页与通用页头接入中文文案

### Task 2：主流程页面与共享组件汉化

已完成并通过规格审查、代码质量审查与回归验证。

关键结果：

- 下载页、分类页、字体大小页、主流程组件已汉化
- `Home` 的筛选迁移 bug 已修复
- 已新增回归测试：[Home.test.tsx](/home/zhpjy/project/proxy/iQbit/src/pages/Home.test.tsx)

关键验证已通过：

- `npx react-scripts test --watch=false --runTestsByPath src/pages/Home.test.tsx`
- `npx tsc --noEmit`

### Task 3：搜索、趋势、插件、集成与标签页汉化

已完成并通过规格审查、代码质量审查。

关键结果：

- 搜索页、热门页、插件页、集成页、标签页已汉化
- 搜索分类已拆成“内部英文值 + 中文展示映射”，避免误改逻辑值

最新相关提交：

- `88ad635` `feat: translate discovery and integrations pages`
- `63abec7` `fix: complete task 3 localization gaps`
- `24a9102` `fix: localize search category labels`

## 当前未完成内容

### Task 4：设置页全量中文化

还未完成。

当前只落地了局部进度，尚未经过审查：

- [src/pages/SettingsPage.tsx](/home/zhpjy/project/proxy/iQbit/src/pages/SettingsPage.tsx)
- [src/components/settings/RequestMoreSettings.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/RequestMoreSettings.tsx)
- [src/locales/zh-CN.ts](/home/zhpjy/project/proxy/iQbit/src/locales/zh-CN.ts)

这些改动的方向是：

- `SettingsPage` 中设置项标题开始切到 `zhCN.settingsPages.*`
- `RequestMoreSettings` 已改成中文说明
- `zhCN` 中新增了 `settingsPages` / `settingsLabels`

但还没有覆盖 Task 4 计划里的其余设置组件，因此不能视为完成。

### Task 5：全量验证与收尾

尚未开始。

## 当前工作树状态

接手前请注意，工作树里有两类改动：

### 1. 应保留并继续处理的汉化改动

- [src/pages/SettingsPage.tsx](/home/zhpjy/project/proxy/iQbit/src/pages/SettingsPage.tsx)
- [src/components/settings/RequestMoreSettings.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/RequestMoreSettings.tsx)
- [src/locales/zh-CN.ts](/home/zhpjy/project/proxy/iQbit/src/locales/zh-CN.ts)

### 2. 不要提交到汉化提交中的无关脏文件

- `release/public/**`
- [2026-04-25-chinese-localization.md](/home/zhpjy/project/proxy/iQbit/docs/superpowers/plans/2026-04-25-chinese-localization.md)

## 接手建议

建议下一个 agent 从 Task 4 继续，按原计划执行，不要跳过审查闭环：

1. 先完成设置页剩余文件汉化
2. 先做规格审查
3. 再做代码质量审查
4. 审查通过后再进入 Task 5

## Task 4 剩余目标文件

- [AllAnnouncements.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/AllAnnouncements.tsx)
- [DownloadsPage.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Downloads/DownloadsPage.tsx)
- [SavingManagement.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Downloads/SavingManagement.tsx)
- [WhenAddingTorrent.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Downloads/WhenAddingTorrent.tsx)
- [ConnectionPage.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Connection/ConnectionPage.tsx)
- [ConnectionLimits.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Connection/ConnectionLimits.tsx)
- [IP Filtering.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Connection/IP Filtering.tsx)
- [ProxyServer.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Connection/ProxyServer.tsx)
- [SpeedPage.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Speed/SpeedPage.tsx)
- [GlobalRateLimits.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Speed/GlobalRateLimits.tsx)
- [AlternativeRateLimits.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Speed/AlternativeRateLimits.tsx)
- [RateLimitingSettings.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/Speed/RateLimitingSettings.tsx)
- [Language.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/WebUI/Language.tsx)
- [WebUIPage.tsx](/home/zhpjy/project/proxy/iQbit/src/components/settings/WebUI/WebUIPage.tsx)

## Task 4 基线检查命令

```bash
rg -n 'Global Rate Limits|Alternative Rate Limits|Connection Limits|Proxy Server|Language|Use HTTPS instead of HTTP|Save Changes|Reset|Need other settings from this page\?' src/pages/SettingsPage.tsx src/components/settings
```

预期：当前应有多条命中。

## Task 4 完成后建议验证

```bash
rg -n 'Global Rate Limits|Alternative Rate Limits|Connection Limits|Proxy Server|Need other settings from this page\?|Use HTTPS instead of HTTP|Peer Connection Protocol|Enable Alternative Rate Limit Scheduler' src/pages/SettingsPage.tsx src/components/settings
npx tsc --noEmit
```

## Task 5 最终验证建议

```bash
rg -n 'Please Sign In|Sign In|Log Out|Downloads|Search Plugins|Show All|Read More|Read Less|Add Plugin|Save Changes|Global Rate Limits|Proxy Server|Need other settings from this page\?' src/pages src/components src/searchAPIs src/layout src/Pages.tsx
node scripts/check-cn-ui.mjs
npm run build
git status --short
```

## 重要约束

- 只翻译用户可见文本
- 内部 key、状态值、query key、provider id、storage key、API 字段保持英文
- 不要把 `release/public/**` 一起提交进汉化提交
- 用户已明确允许直接在 `master` 上开发
