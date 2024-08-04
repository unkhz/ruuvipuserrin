FROM ghcr.io/unkhz/ruuvipuserrin-base-bun AS build

WORKDIR /app

# Install dev deps for build
RUN bun install --frozen-lockfile

WORKDIR /app/packages/configurator

RUN bun x remix vite:build

#########################################
FROM node:20-alpine

WORKDIR /app

COPY --link --from=ghcr.io/unkhz/ruuvipuserrin-base-bun /app/node_modules ./node_modules
COPY --link --from=build /app/packages/configurator/build ./build

WORKDIR /app/packages/configurator

EXPOSE 3000

ENV PORT=3000

CMD ["npx", "remix-serve", "build/server/index.js"]