FROM oven/bun:1.2.15-alpine@sha256:37b37b8cefbf88956d4cbecbc5b3ac4b3f1a9fb051f745c98a4bc6f5f285aacb
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
