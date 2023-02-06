import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { getEnv } from './env'

export function createWriteApi() {
  const env = getEnv()
  const db = new InfluxDB({ url: env.INFLUX_URL, token: env.INFLUX_TOKEN })
  return db.getWriteApi(env.INFLUX_ORG, env.INFLUX_BUCKET)
}

export function createPoint(name: string) {
  return new Point(name)
}
