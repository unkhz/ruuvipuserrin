import { initTRPC } from '@trpc/server'
import z from 'zod'
import { ConfigTable, SourceView, sql } from '@ruuvipuserrin/common-postgres'
import { ZConfig, ZMeasurement, ZValidTenantId } from '@ruuvipuserrin/common-data'

import type { Context } from './context'

export const trpc = initTRPC.context<Context>().create()

export const archiveApiRouter = trpc.router({
  getSources: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = await ctx.dbForTenant(input.tenantId)
      const result = await db.selectFrom('measurement').select('source').distinct().execute()
      return Array.from(result.values()).map((row) => row.source)
    }),
  addMeasurement: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
        measurement: ZMeasurement,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { source, time, temperature, humidity, pressure } = input.measurement
      const db = await ctx.dbForTenant(input.tenantId)
      return db
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
  getCurrentConfigs: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = await ctx.dbForTenant(input.tenantId)
      const query = sql<Pick<SourceView, 'source'> & Partial<ConfigTable>>`
        SELECT
          s.source,
          c.time, c.name, c.shortname, c.location
        FROM
          source as s
        LEFT JOIN config AS c ON s.source = c.source AND c.time = (SELECT max(time) FROM config WHERE source = s.source);
      `
      const result = await query.execute(db)
      return Array.from(result.rows)
    }),
  addConfig: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
        config: ZConfig,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { source, time, name, shortname, location } = input.config
      const db = await ctx.dbForTenant(input.tenantId)
      return db
        .insertInto('config')
        .values({
          time: sql`to_timestamp(${time})`,
          source,
          name,
          shortname,
          location,
          // deprercated field
          listener: '',
        })
        .execute()
    }),
})

export type ArchiveApiRouter = typeof archiveApiRouter
