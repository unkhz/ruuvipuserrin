FROM ghcr.io/unkhz/ruuvipuserrin-base-bun@sha256:fdc47808dc50aa4f1a5917b6116ed26043de01627465fdd1d3d03ea66ab294dd AS build

WORKDIR /app

# Install dev deps for build
RUN bun install

WORKDIR /app/packages/configurator

RUN bun x remix vite:build

WORKDIR /app/packages/configurator

EXPOSE 3000

ENV PORT=3000

CMD ["bunx", "remix-serve", "./build/server/index.js"]