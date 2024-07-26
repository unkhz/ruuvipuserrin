FROM ghcr.io/unkhz/ruuvipuserrin-base-node

WORKDIR /app/packages/configurator

EXPOSE 3000

ENV PORT 3000

CMD ["npx", "@remix-run/serve", "build/server/index.js"]