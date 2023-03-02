import { ColumnType } from 'kysely'
import { z } from 'zod'

export interface MeasurementTable {
  time: ColumnType<Date, string | undefined, never>
  source: string
  temperature: number
  humidity: number
  pressure: number
}

export interface ConfigTable {
  time: ColumnType<Date, string | undefined, never>
  source: string
  name: string
  shortname: string
  listener: string
  location: string
}

export interface Database {
  measurement: MeasurementTable
  config: ConfigTable
}

// TODO: Placeholder decision for valid tenant ids
export const ZValidTenantId = z.enum(['dev', 'test', 'prod'])
export type ValidTenantId = z.infer<typeof ZValidTenantId>
