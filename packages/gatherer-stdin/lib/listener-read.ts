import { readArgs } from './args.js'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { parseLineFromRuuvitagListener } from './transform.js'

const args = readArgs()

export async function processMeasurementsFromStandardInput(cb: (data: RuuviMeasurement) => void) {
  console.log(
    `Reading ruuvitag-listener measurements from stdin with the name "${args.measurementName}" (configure with option --measurementName)`,
  )

  for await (const line of Bun.stdin.stream()) {
    // Only process input with sepcific ruuvitag-listener influxdb measurement name
    if (line.startsWith(args.measurementName)) {
      const measurement = parseLineFromRuuvitagListener(line)
      if (measurement) {
        cb(measurement)
      }
    }
  }
}
