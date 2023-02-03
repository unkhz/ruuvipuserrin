import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { getMeasurementSnapshot } from './listener'
import express from 'express'

const trpc = initTRPC.create()

const router = trpc.router({
  measurements: trpc.procedure.query(() => {
    return getMeasurementSnapshot()
  }),
})

export type RelayRouter = typeof router

export function createServer() {
  const app = express()

  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router,
    }),
  )

  return app
}
