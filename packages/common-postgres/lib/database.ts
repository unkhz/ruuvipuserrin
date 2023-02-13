import { ColumnType } from 'kysely'

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
  location: string
}

export interface Database {
  measurement: MeasurementTable
  config: ConfigTable
}
