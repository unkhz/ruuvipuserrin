import { readArgs } from './lib/args'
import { writeMeasurementsToInfluxDb } from './lib/influxdb-write'
import { writeMeasurementsToTimescaleDb } from './lib/pg-write'
import { readMeasurementsFromRelay } from './lib/relay-client'

async function run() {
  const { pollingInterval } = readArgs()

  console.log(`Scheduler started. Running publish every ${pollingInterval} ms`)

  while (true) {
    const intervalPromise: Promise<void> = new Promise((resolve) => setTimeout(() => resolve(), pollingInterval))
    const measurementSnapshot = await readMeasurementsFromRelay()
    await Promise.all([
      writeMeasurementsToTimescaleDb(measurementSnapshot),
      writeMeasurementsToInfluxDb(measurementSnapshot),
      intervalPromise,
    ])
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
