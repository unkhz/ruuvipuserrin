FROM oven/bun:1.3.10-alpine@sha256:32f1fcccb1523960b254c4f80973bee1a910d60be000a45c20c9129a1efcffee
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
