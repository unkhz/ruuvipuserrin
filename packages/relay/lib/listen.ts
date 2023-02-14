import { Redis } from 'ioredis'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { readArgs } from './args'

const queue = new Redis({
  host: 'localhost',
  port: 6379,
})
queue.on('error', (err) => console.error(err))

const args = readArgs()

const snapshot: Map<string, RuuviMeasurement> = new Map()

type Message = [id: Buffer, fields: Buffer[]]

async function processMessage([id, [key, data]]: Message) {
  const decoded = RuuviMeasurement.decode(data)
  snapshot.set(decoded.mac, decoded)
}

async function processRange(range: Message[]) {
  if (range?.length) {
    await Promise.all(range.map(processMessage))
    const [lastId] = range.at(-1) ?? []
    if (lastId) {
      await Promise.all([queue.xtrim(args.measurementName, 'MINID', lastId), queue.xdel(args.measurementName, lastId)])
    }
  }
}

const batchSize = 100

export async function processMeasurementsFromQueue() {
  console.log(
    `Handling listener measurements with the name "${args.measurementName}" (configure with option --measurementName)`,
  )

  while (true) {
    const range = await queue.xrangeBuffer(args.measurementName, '-', '+', 'COUNT', batchSize)
    await processRange(range)
    await new Promise(setImmediate)
  }
}

export function getMeasurementSnapshot(): Record<string, RuuviMeasurement> {
  return Object.fromEntries(snapshot.entries())
}
