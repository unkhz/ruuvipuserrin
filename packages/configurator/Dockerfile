FROM ghcr.io/unkhz/ruuvipuserrin-base-bun

WORKDIR /app

EXPOSE 3000

ENV PORT 3000

CMD ["bun", "x", "@remix-run/serve", "packages/configurator/build/server/index.js"]