import { readArgs } from './lib/args'
import { parseLineFromRuuvitagListener } from './lib/listener'

const readline = require('node:readline')

const standardInputStream = readline.createInterface({
  input: process.stdin,
})

const args = readArgs()

console.log(
  `Handling listener measurements with the name "${args.measurementName}" (configure with option --measurementName)`,
)

standardInputStream.on('line', (line: string) => {
  // Only process input with sepcific ruuvitag-listener influxdb measurement name
  if (line.startsWith(args.measurementName)) {
    const measurement = parseLineFromRuuvitagListener(line)
    process.stdout.write(`${JSON.stringify(measurement)}\n`)
  }
})
