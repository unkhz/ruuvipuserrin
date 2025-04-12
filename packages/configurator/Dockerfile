FROM ghcr.io/unkhz/ruuvipuserrin-base-bun AS build

WORKDIR /app

# Install dev deps for build
RUN bun install

WORKDIR /app/packages/configurator

RUN bun x remix vite:build

#########################################
FROM  oven/bun:1.2.9-alpine

WORKDIR /app

COPY --link --from=ghcr.io/unkhz/ruuvipuserrin-base-bun /app/node_modules ./node_modules
COPY --link --from=build /app/packages/configurator/build ./packages/configurator/build

WORKDIR /app/packages/configurator

EXPOSE 3000

ENV PORT=3000

CMD ["bun x", "remix-serve", "./build/server/index.js"]