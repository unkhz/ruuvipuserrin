import ws from 'ws'
import fetch from 'node-fetch-commonjs'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { RelayRouter } from '@ruuvipuserrin/relay'

// polyfill fetch & websocket, see https://github.com/trpc/trpc/discussions/1982#discussioncomment-2946392
const globalAny = global as any
globalAny.AbortController = AbortController
globalAny.fetch = fetch
globalAny.WebSocket = ws

// Notice the <AppRouter> generic here.
export const relayClient = createTRPCProxyClient<RelayRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:2021/trpc',
    }),
  ],
})
