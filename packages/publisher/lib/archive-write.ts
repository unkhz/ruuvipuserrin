import type { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { createClient } from '@ruuvipuserrin/common-archive-client'
import { getEnv } from './env'

const client = createClient()
const env = getEnv()

export async function pushMeasurementsToArchive(measurements: Record<string, RuuviMeasurement>) {
  for (const [_id, measurement] of Object.entries(measurements)) {
    const {
      mac,
      time: timeAsMicroSeconds,
      temperature,
      humidity,
      pressure,
      tx_power,
      battery_potential: batteryPotentialAsMilliVolts,
      movement_counter,
    } = measurement
    const source = mac.toLowerCase().replace(/[^a-z0-9]/g, '')
    const time = timeAsMicroSeconds / 1e9
    const battery_potential = Math.round(batteryPotentialAsMilliVolts * 1000)
    const tenantId = env.TENANT_ID
    await client.addMeasurement.mutate({
      tenantId,
      measurement: { source, time, temperature, humidity, pressure, tx_power, battery_potential, movement_counter },
    })
  }
}
