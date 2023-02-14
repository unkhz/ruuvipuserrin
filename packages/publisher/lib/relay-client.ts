import ws from 'ws'
import fetch from 'node-fetch-commonjs'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { RelayRouter } from '@ruuvipuserrin/relay/lib/router'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'

// polyfill fetch & websocket, see https://github.com/trpc/trpc/discussions/1982#discussioncomment-2946392
const globalAny = global as any
globalAny.AbortController = AbortController
globalAny.fetch = fetch
globalAny.WebSocket = ws

export const relayClient = createTRPCProxyClient<RelayRouter>({
  links: [
    httpBatchLink({
      url: 'http://127.0.0.1:2021/trpc',
    }),
  ],
})

export async function readMeasurementsFromRelay(): Promise<Record<string, RuuviMeasurement>> {
  return relayClient.measurements.query()
}
