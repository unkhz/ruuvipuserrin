FROM oven/bun:1.2.10-alpine@sha256:e8e1d291c25b617d7dda08c839fe00d1524a8ccb253c37eb8e9c6e0525da3c89
WORKDIR /app

COPY package.json bun.lock ./

# Add bun install dependencies
COPY packages/archive/package.json ./packages/archive/
COPY packages/base-bun/package.json ./packages/base-bun/
COPY packages/configurator/package.json ./packages/configurator/
COPY packages/common-archive-client/package.json ./packages/common-archive-client/
COPY packages/common-data/package.json ./packages/common-data/
COPY packages/common-postgres/package.json ./packages/common-postgres/
COPY packages/gatherer-http/package.json ./packages/gatherer-http/
COPY packages/gatherer-stdin/package.json ./packages/gatherer-stdin/
COPY packages/publisher/package.json ./packages/publisher/

# Install deps
RUN bun install --production

# Copy source code
COPY packages/archive ./packages/archive/
COPY packages/configurator ./packages/configurator/
COPY packages/base-bun ./packages/base-bun/
COPY packages/common-archive-client ./packages/common-archive-client/
COPY packages/common-data ./packages/common-data/
COPY packages/common-postgres ./packages/common-postgres/
