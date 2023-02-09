export interface MeasurementTable {
  time: number
  source: string
  temperature: number
  humidity: number
  pressure: number
}

export interface ConfigTable {
  time: number
  source: string
  location: string
}

export interface Database {
  measurement: MeasurementTable
  config: ConfigTable
}
