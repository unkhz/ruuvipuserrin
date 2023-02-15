import type { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { createPoint, createWriteApi } from '@ruuvipuserrin/common-influxdb'

const api = createWriteApi()

export async function writeMeasurementsToInfluxDb(measurements: Record<string, RuuviMeasurement>) {
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
  await api.flush(false)
}
