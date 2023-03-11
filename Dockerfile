FROM node:lts-slim as buildtime
WORKDIR /app
COPY package*.json nx.json /app/
COPY packages /app/packages

# Install dev deps for buildtime
RUN npm ci

# Build any node packages
RUN npx nx run-many --target=node:build --all

# Clean slate for runtime
FROM node:lts-slim as runtime
WORKDIR /app
COPY --from=buildtime /app/package*.json /app/nx.json /app/
COPY --from=buildtime /app/packages /app/packages

# Remove dev deps for runtime
RUN npm ci --omit=dev