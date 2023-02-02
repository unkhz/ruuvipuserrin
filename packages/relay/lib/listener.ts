import { readArgs } from './args'
import { parseLineFromRuuvitagListener, RuuvitagMeasurement } from './measurement'

const readline = require('node:readline')
const standardInputStream = readline.createInterface({
  input: process.stdin,
})

const args = readArgs()

const snapshot: Map<string, RuuvitagMeasurement> = new Map()

export async function processMeasurementsFromStandardInput() {
  console.log(
    `Handling listener measurements with the name "${args.measurementName}" (configure with option --measurementName)`,
  )

  standardInputStream.on('line', (line: string) => {
    // Only process input with sepcific ruuvitag-listener influxdb measurement name
    if (line.startsWith(args.measurementName)) {
      const measurement = parseLineFromRuuvitagListener(line)
      snapshot.set(measurement.id, measurement)
    }
  })
}

export function getMeasurementSnapshot(): Record<string, RuuvitagMeasurement> {
  return Object.fromEntries(snapshot.entries())
}
