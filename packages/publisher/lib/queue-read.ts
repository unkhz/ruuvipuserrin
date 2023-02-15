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

async function processRange(range: Message[], processMessage: (data: Buffer) => Promise<void>) {
  if (range?.length) {
    await Promise.all(range.map(([id, [key, data]]: Message) => processMessage(data)))
    const [lastId] = range.at(-1) ?? []
    if (lastId) {
      await Promise.all([queue.xtrim(args.measurementName, 'MINID', lastId), queue.xdel(args.measurementName, lastId)])
    }
  }
}

const batchSize = 100

export async function processMeasurementsFromQueue(processMessage: (data: Buffer) => Promise<void>) {
  const len = await queue.xlen(args.measurementName)
  console.log(
    `Pulling measurement snapshots from queue with the name "${args.measurementName}" (configure with option --measurementName)`,
  )
  console.debug(`Queue has ${len} snapshots`)

  while (true) {
    const intervalPromise = new Promise((resolve) => setTimeout(resolve, args.pollingInterval))
    const range = await queue.xrangeBuffer(args.measurementName, '-', '+', 'COUNT', batchSize)
    await Promise.all([processRange(range, processMessage), intervalPromise])
  }
}

export function getMeasurementSnapshot(): Record<string, RuuviMeasurement> {
  return Object.fromEntries(snapshot.entries())
}
