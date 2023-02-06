import { relayClient } from './relay-client'
import { createPoint, createWriteApi } from '@ruuvipuserrin/common-influxdb'
export * from './args'

export async function readMeasurements() {
  return relayClient.measurements.query()
}

export async function writeMeasurements(measurements: Awaited<ReturnType<typeof readMeasurements>>) {
  const api = createWriteApi()
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
