import { initTRPC } from '@trpc/server'
import z from 'zod'
import { ConfigTable, SourceView, sql } from '@ruuvipuserrin/common-postgres'
import { ZConfig, ZHealthMeasurement, ZMeasurement, ZValidTenantId } from '@ruuvipuserrin/common-data'

import type { Context } from './context.js'

export const trpc = initTRPC.context<Context>().create()

let timeout: NodeJS.Timeout | undefined
function debounce(cb: () => void) {
  if (timeout) {
    clearTimeout(timeout)
  }
  timeout = setTimeout(() => {
    timeout = undefined
    cb()
  }, 1000)
}

export const archiveApiRouter = trpc.router({
  getSources: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = await ctx.dbForTenant(input.tenantId)
      const result = await db.selectFrom('source').select('source').execute()
      return Array.from(result.values()).map((row) => row.source)
    }),
  addMeasurement: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
        measurement: ZMeasurement.merge(ZHealthMeasurement),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { source, time, temperature, humidity, pressure, tx_power, battery_potential, movement_counter } =
        input.measurement
      if (process.env.DEBUG) {
        console.debug('Received measurement', time)
      }
      const db = await ctx.dbForTenant(input.tenantId)
      db.transaction()
        .setIsolationLevel('read committed')
        .execute(async (trx) => {
          await trx
            .insertInto('ruuvi_measurement')
            .values({
              time: sql`to_timestamp(${time})`,
              source,
              temperature,
              humidity,
              pressure,
            })
            .execute()
          await trx
            .insertInto('ruuvi_health')
            .values({
              time: sql`to_timestamp(${time})`,
              source,
              tx_power,
              battery_potential,
              movement_counter,
            })
            .execute()
        })
      debounce(() =>
        sql`
          SELECT refresh_measurement_aggregates();
        `.execute(db),
      )
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
      await db
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
      // Invalidate downsampled measurements
      debounce(async () => {
        await sql`
          DELETE FROM ruuvi_measurement_1m WHERE time >= to_timestamp(${time});
        `
        await sql`
          DELETE FROM ruuvi_measurement_1h WHERE time >= to_timestamp(${time});
        `
      })
    }),
  refreshDownsampledMeasurements: trpc.procedure
    .input(
      z.object({
        tenantId: ZValidTenantId,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = await ctx.dbForTenant(input.tenantId)
      await sql`
        SELECT refresh_measurement_aggregates();
      `.execute(db)
    }),
})

export type ArchiveApiRouter = typeof archiveApiRouter
