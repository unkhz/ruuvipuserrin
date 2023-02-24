import type { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { createClient } from '@ruuvipuserrin/common-archive-client'

const client = createClient()

export async function pushMeasurementsToArchive(measurements: Record<string, RuuviMeasurement>) {
  for (const [_id, measurement] of Object.entries(measurements)) {
    const { mac, time: timeAsMicroSeconds, temperature, humidity, pressure } = measurement
    const source = mac.toLowerCase().replace(/[^a-z0-9]/g, '')
    const time = timeAsMicroSeconds / 1e9
    await client.addMeasurements.mutate({ source, time, temperature, humidity, pressure })
  }
}
