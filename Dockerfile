FROM node:lts-alpine AS buildtime
WORKDIR /app
COPY package*.json nx.json /app/

# Add any node packages
COPY packages/archive/*.json /app/packages/archive/
COPY packages/base-node/*.json /app/packages/base-node/
COPY packages/common-data/*.json /app/packages/common-data/
COPY packages/common-postgres/*.json /app/packages/common-postgres/

# Install dev deps for buildtime
RUN npm ci

# Copy source code
COPY packages/archive /app/packages/archive/
COPY packages/base-node /app/packages/base-node/
COPY packages/common-data /app/packages/common-data/
COPY packages/common-postgres /app/packages/common-postgres/

# Build any node packages
RUN npx nx run-many --target=node:build --all

# Clean slate for runtime
FROM node:lts-alpine AS runtime
WORKDIR /app
COPY --link --from=buildtime /app/package*.json /app/nx.json /app/
COPY --link --from=buildtime /app/packages /app/packages

# Remove dev deps for runtime
RUN npm ci --omit=dev