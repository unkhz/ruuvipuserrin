import { z } from 'zod'
import { InfluxDB, Point } from '@influxdata/influxdb-client'

const ZEnv = z.object({
  INFLUX_URL: z.string(),
  INFLUX_TOKEN: z.string(),
  INFLUX_ORG: z.string(),
  INFLUX_BUCKET: z.string(),
})

const env = ZEnv.parse(process.env)

export function createWriteApi() {
  const db = new InfluxDB({ url: env.INFLUX_URL, token: env.INFLUX_TOKEN })
  return db.getWriteApi(env.INFLUX_ORG, env.INFLUX_BUCKET)
}

export function createPoint(name: string) {
  return new Point(name)
}
