# Docker Image Size Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 通过多阶段构建和运行层裁剪，显著缩小 iQbit Docker 镜像体积，同时保持容器功能不变。

**Architecture:** 将 Docker 构建拆分为前端构建阶段、服务端依赖阶段和最小运行阶段。新增 `.dockerignore` 以缩小构建上下文，并把 Docker 运行时不需要的服务端工具依赖移出生产依赖集合。

**Tech Stack:** Docker multi-stage build, Node 20, Yarn, npm

---

### Task 1: 改造 Docker 构建链

**Files:**
- Create: `.dockerignore`
- Modify: `Dockerfile`
- Modify: `server/package.json`
- Modify: `server/package-lock.json`
- Create: `docs/superpowers/specs/2026-04-25-docker-size-optimization-design.md`
- Create: `docs/superpowers/plans/2026-04-25-docker-size-optimization.md`

- [ ] **Step 1: 写入设计文档和计划文档**

```md
记录多阶段构建、最小运行层、.dockerignore 和验证方法。
```

- [ ] **Step 2: 新增 `.dockerignore`**

```gitignore
.git
.github
.idea
docs
node_modules
server/node_modules
.env
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

- [ ] **Step 3: 将 Dockerfile 改为多阶段构建**

```dockerfile
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM node:20-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

FROM gcr.io/distroless/nodejs20-debian12:nonroot
WORKDIR /app/server
COPY --from=server-deps /app/server/node_modules ./node_modules
COPY server/server.js ./server.js
COPY --from=frontend-builder /app/release/public /app/release/public
EXPOSE 8081
CMD ["server.js"]
```

- [ ] **Step 4: 把 Docker 运行时不需要的服务端依赖移到 `devDependencies`**

```json
{
  "dependencies": {
    "express": "^4.18.1",
    "http-proxy-middleware": "^2.0.6"
  },
  "devDependencies": {
    "nodemon": "^2.0.19",
    "pm2": "^5.2.0"
  }
}
```

- [ ] **Step 5: 更新 `server/package-lock.json`**

Run: `npm install --package-lock-only`
Expected: 锁文件与新的依赖分类保持一致

### Task 2: 验证镜像大小和运行行为

**Files:**
- Verify: `Dockerfile`
- Verify: `.dockerignore`
- Verify: `server/package.json`
- Verify: `server/package-lock.json`

- [ ] **Step 1: 无缓存构建镜像**

Run: `docker build --no-cache -t iqbit-ghcr-slim .`
Expected: 构建成功

- [ ] **Step 2: 记录镜像大小**

Run: `docker image ls iqbit-ghcr-slim`
Expected: 体积显著低于旧镜像 `iqbit-ghcr-test:latest`

- [ ] **Step 3: 启动容器并验证首页可访问**

Run: `docker run --rm -d -p 18081:8081 --name iqbit-ghcr-slim-test iqbit-ghcr-slim`
Expected: 容器成功启动

- [ ] **Step 4: 请求首页**

Run: `curl -I http://127.0.0.1:18081`
Expected: 返回 `HTTP/1.1 200 OK`

- [ ] **Step 5: 停止测试容器**

Run: `docker stop iqbit-ghcr-slim-test`
Expected: 容器停止成功
