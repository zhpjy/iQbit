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

ENV QBIT_HOST=http://localhost:8080
ENV STANDALONE_SERVER_PORT=8081

COPY --from=server-deps /app/server/node_modules ./node_modules
COPY server/server.js ./server.js
COPY --from=frontend-builder /app/release/public /app/release/public

EXPOSE 8081

CMD ["server.js"]
