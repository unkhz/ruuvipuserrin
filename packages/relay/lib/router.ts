import { initTRPC } from '@trpc/server'
import { getMeasurementSnapshot } from './listen'

const trpc = initTRPC.create()

export const relayRouter = trpc.router({
  measurements: trpc.procedure.query(() => {
    return getMeasurementSnapshot()
  }),
})

export type RelayRouter = typeof relayRouter
