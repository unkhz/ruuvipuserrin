import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { processMeasurementsFromQueue } from './lib/listen'
import { relayRouter } from './lib/router'
import { createContext } from './lib/context'
export * from './lib/router'

processMeasurementsFromQueue()

export default {
  port: 2021,
  async fetch(request: Request): Promise<Response> {
    return fetchRequestHandler({
      endpoint: '/trpc',
      req: request,
      router: relayRouter,
      createContext,
    })
  },
}
