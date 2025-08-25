FROM oven/bun:1.2.21-alpine@sha256:02564b43c26a0dc156ff4b70d7ccb68ebae5c486771d699ed1520c42e6ac5cb0
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
