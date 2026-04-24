# GHCR Publish Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为仓库添加 GitHub Actions 工作流，在 `master` 分支收到 push 时自动构建并推送 Docker 镜像到 `ghcr.io/zhpjy/iqbit`。

**Architecture:** 新增独立的 Docker 发布 workflow，不改动现有手动构建提交流程。工作流使用 GitHub 官方 Docker actions 完成 checkout、登录 GHCR、生成镜像标签、构建并推送镜像。

**Tech Stack:** GitHub Actions YAML, GHCR, Dockerfile, Docker Buildx

---

### Task 1: 写入设计与发布工作流

**Files:**
- Create: `docs/superpowers/specs/2026-04-25-ghcr-publish-design.md`
- Create: `docs/superpowers/plans/2026-04-25-ghcr-publish.md`
- Create: `.github/workflows/docker-publish.yml`
- Modify: `Dockerfile`

- [ ] **Step 1: 先写设计文档与计划文档**

```md
- 设计文档说明触发条件、镜像地址、标签策略、权限需求和风险
- 计划文档固定实现边界：新增独立 workflow，不改 Dockerfile
```

- [ ] **Step 2: 新增 Docker 发布工作流**

```yaml
name: Docker Publish

on:
  push:
    branches:
      - master
  workflow_dispatch:

permissions:
  contents: read
  packages: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/zhpjy/iqbit
          tags: |
            type=raw,value=latest,enable={{is_default_branch}}
            type=sha,prefix=sha-

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

- [ ] **Step 3: 修正 Docker 构建环境的 Node 版本**

```dockerfile
FROM node:20
ENV QBIT_HOST=http://localhost:8080
WORKDIR /usr/src/node-app
COPY . ./
RUN yarn install --frozen-lockfile
RUN yarn build
RUN npm run server-setup
```

- [ ] **Step 4: 检查文件差异**

Run: `git diff -- docs/superpowers/specs/2026-04-25-ghcr-publish-design.md docs/superpowers/plans/2026-04-25-ghcr-publish.md .github/workflows/docker-publish.yml Dockerfile`
Expected: 出现新增文档、新增 workflow、以及 `Dockerfile` 中基础 Node 版本的最小修改

### Task 2: 验证工作流与 Docker 构建

**Files:**
- Verify: `.github/workflows/docker-publish.yml`
- Verify: `Dockerfile`

- [ ] **Step 1: 检查 workflow 文件内容**

Run: `sed -n '1,220p' .github/workflows/docker-publish.yml`
Expected: 包含 `push.branches = master`、`workflow_dispatch`、`packages: write`、`ghcr.io/zhpjy/iqbit`

- [ ] **Step 2: 进行 YAML 语法校验**

Run: `python3 - <<'PY'\nimport yaml, pathlib\npath = pathlib.Path('.github/workflows/docker-publish.yml')\nwith path.open() as f:\n    yaml.safe_load(f)\nprint('yaml-ok')\nPY`
Expected: 输出 `yaml-ok`

- [ ] **Step 3: 本地验证 Docker 构建**

Run: `docker build -t iqbit-ghcr-test .`
Expected: 构建成功，退出码为 0

- [ ] **Step 4: 检查最终状态**

Run: `git status --short`
Expected: 仅包含本次新增或修改的文档与 workflow 文件
