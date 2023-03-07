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

export interface SourceView {
  source: string
}

export interface Database {
  measurement: MeasurementTable
  config: ConfigTable
  source: SourceView
}
