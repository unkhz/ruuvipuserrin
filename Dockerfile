FROM node:lts-slim as buildtime
WORKDIR /app
COPY package*.json nx.json /app/

# Install node packages
COPY packages/archive/package.json /app/packages/archive/package.json
COPY packages/base-node/package.json /app/packages/base-node/package.json
COPY packages/common-data/package.json /app/packages/common-data/package.json
COPY packages/common-postgres/package.json /app/packages/common-postgres/package.json

# Install dev deps for buildtime
RUN npm ci

# Install node package source code
COPY packages/archive/* /app/packages/archive/*
COPY packages/base-node/* /app/packages/base-node/*
COPY packages/common-data/* /app/packages/common-data/*
COPY packages/common-postgres/* /app/packages/common-postgres/*

# Build any node packages
RUN npx nx run-many --target=node:build --all

# Clean slate for runtime
FROM node:lts-slim as runtime
WORKDIR /app
COPY --from=buildtime /app/package*.json /app/nx.json /app/
COPY --from=buildtime /app/packages /app/packages

# Remove dev deps for runtime
RUN npm ci --omit=dev