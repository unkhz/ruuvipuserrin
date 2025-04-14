import { ColumnType } from 'kysely'

export interface RuuviMeasurementTable {
  time: ColumnType<Date, string | undefined, never>
  source: string
  temperature: number
  humidity: number
  pressure: number
}

export interface DownsampledMeasurementView {
  time: ColumnType<Date, string | undefined, never>
  name: string
  temperature: number
  humidity: number
  pressure: number
}

export interface RuuviHealthTable {
  time: ColumnType<Date, string | undefined, never>
  source: string
  tx_power: number
  battery_potential: number
  movement_counter: number
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
  ruuvi_measurement: RuuviMeasurementTable
  ruuvi_measurement_1m: DownsampledMeasurementView
  ruuvi_measurement_1h: DownsampledMeasurementView
  ruuvi_health: RuuviHealthTable
  config: ConfigTable
  source: SourceView
}
