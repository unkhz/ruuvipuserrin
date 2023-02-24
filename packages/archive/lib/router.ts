import { initTRPC } from '@trpc/server'
import z from 'zod'
import { sql } from '@ruuvipuserrin/common-postgres'
import type { Context } from './context'

export const trpc = initTRPC.context<Context>().create()

const ZMeasurement = z.object({
  source: z.string(),
  time: z.number(),
  temperature: z.number(),
  humidity: z.number(),
  pressure: z.number(),
})

export const archiveApiRouter = trpc.router({
  getSources: trpc.procedure.query(async ({ ctx }) => {
    const result = await ctx.db.selectFrom('measurement').select('source').distinct().execute()
    return Array.from(result.values()).map((row) => row.source)
  }),
  addMeasurements: trpc.procedure.input(ZMeasurement).mutation(({ ctx, input }) => {
    const { source, time, temperature, humidity, pressure } = input
    ctx.db
      .insertInto('measurement')
      .values({
        time: sql`to_timestamp(${time})`,
        source,
        temperature,
        humidity,
        pressure,
      })
      .execute()
  }),
})

export type ArchiveApiRouter = typeof archiveApiRouter
