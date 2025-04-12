FROM ghcr.io/unkhz/ruuvipuserrin-base-bun AS build

WORKDIR /app

# Install dev deps for build
RUN bun install

WORKDIR /app/packages/configurator

RUN bun x remix vite:build

#########################################
FROM node:22-alpine

WORKDIR /app

COPY --link --from=ghcr.io/unkhz/ruuvipuserrin-base-bun /app/node_modules ./node_modules
COPY --link --from=build /app/packages/configurator/build ./packages/configurator/build

WORKDIR /app/packages/configurator/build/server

EXPOSE 3000

ENV PORT=3000

CMD ["npx", "remix-serve", "/app/packages/configurator/build/server/index.js"]