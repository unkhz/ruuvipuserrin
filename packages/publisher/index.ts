import { RuuviMeasurementSnapshot, RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { processMeasurementsFromQueue } from './lib/queue-read.js'
import { pushMeasurementsToArchive } from './lib/archive-write.js'

function readMeasurements(data: Buffer): RuuviMeasurement[] {
  try {
    const snapshot = RuuviMeasurementSnapshot.decode(data)
    return snapshot.measurements
  } catch (err) {
    console.error('Decoding failed, skipping measurement:', err)
  }
  return []
}

async function processMessage(data: Buffer) {
  const measurements = readMeasurements(data)
  if (measurements.length) {
    const objectSnapshot = Object.fromEntries(measurements.map((measurement) => [measurement.mac, measurement]))
    await Promise.all([pushMeasurementsToArchive(objectSnapshot)])
  }
}

processMeasurementsFromQueue(processMessage).catch((err) => {
  console.error(err)
  process.exit(1)
})
