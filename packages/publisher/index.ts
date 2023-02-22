import { RuuviMeasurementSnapshot } from '@ruuvipuserrin/common-data'
import { processMeasurementsFromQueue } from './lib/queue-read'
import { writeMeasurementsToTimescaleDb } from './lib/pg-write'

async function processMessage(data: Buffer) {
  const snapshot = RuuviMeasurementSnapshot.decode(data)
  const len = snapshot.measurements.length
  if (len) {
    const objectSnapshot = Object.fromEntries(
      snapshot.measurements.map((measurement) => [measurement.mac, measurement]),
    )
    await Promise.all([writeMeasurementsToTimescaleDb(objectSnapshot)])
  }
}

processMeasurementsFromQueue(processMessage).catch((err) => {
  console.error(err)
  process.exit(1)
})
