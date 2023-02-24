import { initTRPC } from '@trpc/server'
import type { Context } from './context'

export const trpc = initTRPC.context<Context>().create()

export const archiveApiRouter = trpc.router({
  getSources: trpc.procedure.query(async ({ ctx }) => {
    const result = await ctx.db.selectFrom('measurement').select('source').distinct().execute()
    return Array.from(result.values()).map((row) => row.source)
  }),
})

export type ArchiveApiRouter = typeof archiveApiRouter
