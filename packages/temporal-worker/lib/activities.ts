import { relayClient } from './relay-client'
import { createPoint, createWriteApi } from '@ruuvipuserrin/common-influxdb'
import { createClient } from '@ruuvipuserrin/common-postgres'
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
    const { id, mac, time, data } = measurement
    const point = createPoint(mac)
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
    const { id: source, time, data } = measurement
    const { temperature, humidity, pressure } = data
    queries.push(client.insertInto('measurement').values({ time, source, temperature, humidity, pressure }).execute())
  }
  return Promise.all(queries)
}
