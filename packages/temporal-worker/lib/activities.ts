import { relayClient } from './relay-client'
export * from './args'

export async function readMeasurements() {
  return relayClient.measurements.query()
}
