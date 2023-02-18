import { readArgs } from './args'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { parseLineFromRuuvitagListener } from './transform'

const readline = require('node:readline')
const standardInputStream = readline.createInterface({
  input: process.stdin,
})

const args = readArgs()

export async function processMeasurementsFromStandardInput(cb: (data: RuuviMeasurement) => void) {
  console.log(
    `Reading ruuvitag-listener measurements from stdin with the name "${args.measurementName}" (configure with option --measurementName)`,
  )

  standardInputStream.on('line', (line: string) => {
    // Only process input with sepcific ruuvitag-listener influxdb measurement name
    if (line.startsWith(args.measurementName)) {
      const measurement = parseLineFromRuuvitagListener(line)
      cb(measurement)
    }
  })
}
