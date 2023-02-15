import type { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { createClient, sql } from '@ruuvipuserrin/common-postgres'

const client = createClient()

export async function writeMeasurementsToTimescaleDb(measurements: Record<string, RuuviMeasurement>) {
  const queries = []
  for (const [_id, measurement] of Object.entries(measurements)) {
    const { mac, time, ...data } = measurement
    const source = mac.toLowerCase().replace(/[^a-z0-9]/g, '')
    const { temperature, humidity, pressure } = data
    queries.push(
      client
        .insertInto('measurement')
        .values({
          time: sql`to_timestamp(${new Date(time / 1000000).getTime()})`,
          source,
          temperature,
          humidity,
          pressure,
        })
        .execute(),
    )
  }
  await Promise.all(queries)
}
