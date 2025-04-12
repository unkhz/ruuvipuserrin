FROM ghcr.io/unkhz/ruuvipuserrin-base-bun AS build

WORKDIR /app

# Install dev deps for build
RUN bun install

WORKDIR /app/packages/configurator

RUN bun x remix vite:build

WORKDIR /app/packages/configurator

EXPOSE 3000

ENV PORT=3000

CMD ["bunx", "remix-serve", "./build/server/index.js"]