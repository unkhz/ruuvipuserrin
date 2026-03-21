FROM oven/bun:1.3.11-alpine@sha256:7ed9f74c326d1c260abe247ac423ccbf5ac92af62bb442d515d1f92f21e8ea9b
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
