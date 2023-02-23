import { initTRPC } from '@trpc/server'
import { Context } from './context'
import { createClient } from '@ruuvipuserrin/common-postgres'

const client = createClient()

export const trpc = initTRPC.context<Context>().create()

export const archiveApiRouter = trpc.router({
  getSources: trpc.procedure.query(async () => {
    const result = await client.selectFrom('measurement').select('source').distinct().execute()
    return Array.from(result.values()).map((row) => row.source)
  }),
})

export type ArchiveApiRouter = typeof archiveApiRouter
