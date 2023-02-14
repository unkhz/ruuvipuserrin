import type { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { createPoint, createWriteApi } from '@ruuvipuserrin/common-influxdb'

let influxDbWriteApi: Awaited<ReturnType<typeof createWriteApi>>

async function getInfluxDbWriteApi() {
  if (!influxDbWriteApi) {
    influxDbWriteApi = await createWriteApi()
  }
  return influxDbWriteApi
}

export async function writeMeasurementsToInfluxDb(measurements: Record<string, RuuviMeasurement>) {
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
