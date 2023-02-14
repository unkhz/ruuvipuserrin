import { sql } from 'kysely'
import { createPoint, createWriteApi } from '@ruuvipuserrin/common-influxdb'
import { createClient } from '@ruuvipuserrin/common-postgres'
import { relayClient } from './relay-client'
export * from './args'

export async function readMeasurements() {
  return relayClient.measurements.query()
}

let influxDbWriteApi: Awaited<ReturnType<typeof createWriteApi>>

async function getInfluxDbWriteApi() {
  if (!influxDbWriteApi) {
    influxDbWriteApi = await createWriteApi()
  }
  return influxDbWriteApi
}

export async function writeMeasurementsToInfluxDb(measurements: Awaited<ReturnType<typeof readMeasurements>>) {
  const api = await getInfluxDbWriteApi()
  for (const [_id, measurement] of Object.entries(measurements)) {
    const { mac, time, ...data } = measurement
    const point = createPoint(mac)
    const id = mac.toLowerCase().replace(/[^a-z0-9]/g, '')
    point.tag('id', id)
    point.timestamp(time)
    for (const [key, value] of Object.entries(data)) {
      point.floatField(key, value)
    }
    api.writePoint(point)
  }
  return api.flush(false)
}

let pgClient: Awaited<ReturnType<typeof createClient>>

async function getPgClient() {
  if (!pgClient) {
    pgClient = await createClient()
  }
  return pgClient
}

export async function writeMeasurementsToTimescaleDb(measurements: Awaited<ReturnType<typeof readMeasurements>>) {
  const client = await getPgClient()
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
  return Promise.all(queries)
}
