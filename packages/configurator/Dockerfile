FROM ghcr.io/unkhz/ruuvipuserrin-base-bun@sha256:d0f3c8a5f121443c1e7c02ea5ef431b2335280363a15fbc6669e048f90155ea7 AS build

WORKDIR /app

# Install dev deps for build
RUN bun install

WORKDIR /app/packages/configurator

RUN bun x remix vite:build

WORKDIR /app/packages/configurator

EXPOSE 3000

ENV PORT=3000

CMD ["bunx", "remix-serve", "./build/server/index.js"]