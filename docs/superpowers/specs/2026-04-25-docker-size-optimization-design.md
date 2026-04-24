# Docker 镜像瘦身设计

## 背景

当前 [Dockerfile](/home/zhpjy/project/proxy/iQbit/Dockerfile) 采用单阶段构建：

- 构建依赖和运行依赖位于同一层
- 根目录前端依赖、源码、构建缓存都被保留在最终镜像中
- 最终镜像实测约 `3.81GB`

而容器运行时实际只需要：

- `server/server.js`
- 服务端运行依赖
- `release/public` 静态资源

## 目标

- 大幅缩小最终镜像体积
- 保持现有容器功能不变
- 保持现有 GitHub Actions 发布流程可用

## 方案对比

### 方案 A：只清理缓存和无关文件

优点：

- 改动最小

缺点：

- 仍然保留完整前端依赖树
- 只能小幅下降，无法解决根因

### 方案 B：多阶段构建，运行层只保留运行必需文件

优点：

- 能从根本上移除前端构建依赖和源码
- 体积下降最明显
- 不影响运行行为

缺点：

- Dockerfile 改动更大

### 推荐方案

采用方案 B。

## 设计

### 构建阶段

使用独立的前端构建阶段：

- 基于 Node 20 安装根目录依赖
- 运行 `yarn build`
- 产出 `release/public`

### 服务端依赖阶段

使用独立的服务端依赖阶段：

- 只安装 `server` 目录运行时依赖
- 排除 `nodemon` 和 `pm2` 这类 Docker 运行时不需要的依赖

### 运行阶段

最终镜像只保留：

- `server/server.js`
- `server/node_modules`
- `release/public`

容器继续监听 `8081`，并保持 `QBIT_HOST`、`STANDALONE_SERVER_PORT` 行为不变。

### 构建上下文优化

新增 `.dockerignore`，排除：

- `.git`
- `.github`
- `docs`
- 本地 `node_modules`
- IDE 文件
- 本地环境文件
- 与镜像构建无关的杂项文件

这样可以减少构建上下文传输时间，但不会影响运行功能。

## 兼容性约束

- `release/public` 目录不能从构建上下文中排除，因为仓库里已有运行时静态文件
- `server/server.js` 里使用相对路径 `../release/public`，因此最终容器中的工作目录和文件布局必须保持兼容

## 验证策略

1. 本地无缓存 `docker build`
2. 对比优化前后的镜像大小
3. 启动容器并请求 `/`，确认静态页面可访问
