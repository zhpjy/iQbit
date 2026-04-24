# GitHub Actions 自动发布 GHCR 镜像设计

## 背景

项目根目录已经存在可直接用于容器构建的 `Dockerfile`，并且 `server/README.md` 已说明可通过 `docker build -t iqbit .` 手工构建镜像。

当前仓库已有的 GitHub Actions 工作流 `.github/workflows/build_and_commit.yml` 主要用于手动构建并提交仓库内容，不负责 Docker 镜像构建与推送。

本次目标是为仓库补充一个独立的工作流：在代码推送到 `master` 分支时，自动构建 Docker 镜像并推送到 GitHub Container Registry（GHCR）。

## 目标

- 当代码 `push` 到 `master` 分支时，自动构建根目录 `Dockerfile`
- 将镜像推送到 `ghcr.io/zhpjy/iqbit`
- 至少生成以下标签：
  - `latest`
  - 基于 commit SHA 的不可变标签
- 支持手动触发，方便后续补发镜像

## 非目标

- 不对现有 `Dockerfile` 做与本次发布无关的结构重写
- 不把现有 `build_and_commit.yml` 重写为 Docker 发布流程
- 不增加 Docker Hub 或其他镜像仓库推送逻辑
- 不引入多架构构建，先保持单平台构建，降低复杂度

## 方案对比

### 方案 A：新增独立 Docker 发布工作流

在 `.github/workflows/` 下新增一个专门的 Docker 发布工作流，使用官方 action 完成：

- `actions/checkout`
- `docker/login-action`
- `docker/metadata-action`
- `docker/build-push-action`

优点：

- 与现有手动构建提交流程解耦
- 职责清晰，后续扩展多架构或版本标签更容易
- 失败面更小，不会影响已有 announcement 工作流

缺点：

- workflow 文件会增加一个

### 方案 B：直接修改现有 `build_and_commit.yml`

把 Docker 构建与推送混进已有工作流。

优点：

- 文件数量不增加

缺点：

- 现有工作流是手动触发、并且带“修改仓库内容再提交”的职责，和镜像发布耦合后会更难维护
- 触发条件和权限需求不一致

### 推荐方案

采用方案 A。

原因是当前需求只涉及镜像构建与发布，新增独立 workflow 最清晰，也最符合 GitHub Actions 常见组织方式。

## 发布设计

### 触发条件

- `push` 到 `master`
- `workflow_dispatch`

### 镜像地址

- `ghcr.io/zhpjy/iqbit`

### 标签策略

- `latest`：仅 `master` 分支推送时生成
- `sha-<short_sha>`：每次构建生成，便于回滚和定位
- 可保留 branch 标签能力，但当前默认只依赖 `latest` 与 `sha`

### 认证与权限

- 使用 GitHub Actions 内置 `GITHUB_TOKEN`
- workflow 设置：
  - `contents: read`
  - `packages: write`

这足以推送到当前仓库所属组织/用户下的 GHCR 包。

## 实现要点

### Dockerfile 兼容性修正

验证过程中发现当前 `Dockerfile` 同时存在两处兼容性问题：

- 使用 `node:14`，而仓库根目录已经使用 `vite@7` 相关构建链，Node 14 在执行构建时会出现现代语法解析警告
- 在根目录执行 `npm install`，但仓库以 `yarn.lock` 作为锁文件，升级到 Node 20 后会因为 npm 更严格的 peer dependency 解析而失败

因此本次会做一个最小兼容性修正：

- 将基础镜像从 `node:14` 升级到 `node:20`
- 将根目录依赖安装改为 `yarn install --frozen-lockfile`
- 将根目录构建命令改为 `yarn build`
- 保留 `server` 目录现有 `npm` 安装逻辑，不做额外重构

这样可以让 GitHub Actions 中的 Docker 构建环境与当前仓库现有 CI 和锁文件体系保持一致。

### 新增工作流文件

新增 `.github/workflows/docker-publish.yml`：

- checkout 仓库
- 登录 GHCR
- 生成元数据与标签
- 基于根目录 `Dockerfile` 构建并推送镜像

### 与现有工作流关系

保留 `.github/workflows/build_and_commit.yml`，不做功能耦合。

## 验证策略

由于这是 CI 配置变更，优先做以下验证：

1. YAML 结构检查
2. 本地模拟关键表达式和 workflow 语义检查
3. 本地执行 `docker build`，确认当前 `Dockerfile` 仍可构建

真正的推送验证将在 GitHub Actions 环境中完成。

## 风险与处理

### GHCR 权限不足

如果仓库 settings 中 packages 权限受限，workflow 会在登录或推送阶段失败。该问题不通过代码规避，而通过仓库权限配置解决。

### 镜像名大小写问题

GHCR 要求镜像名小写。这里直接使用固定地址 `ghcr.io/zhpjy/iqbit`，避免依赖大小写不确定的动态 owner 变量。

### Dockerfile 构建耗时较长

当前先不做缓存优化，先保证行为正确。后续若需要可再增加 `cache-from` / `cache-to`。
