import { Redis } from 'ioredis'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { readArgs } from './args.js'
import { getEnv } from './env.js'

const { REDIS_HOST, REDIS_PORT } = getEnv()

const queue = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
})

queue.on('error', (err) => console.error(err))

const args = readArgs()

const snapshot: Map<string, RuuviMeasurement> = new Map()

type Message = [id: Buffer, fields: Buffer[]]

async function processRange(range: Message[], processMessage: (data: Buffer) => Promise<void>) {
  if (range?.length) {
    try {
      await Promise.all(
        range.map(([id, [key, data]]: Message) => {
          if (data !== undefined) {
            processMessage(data)
          }
        }),
      )
      const [lastId] = range.at(-1) ?? []
      if (lastId) {
        await Promise.all([
          queue.xtrim(args.measurementName, 'MINID', lastId),
          queue.xdel(args.measurementName, lastId),
        ])
      }
    } catch (err) {
      throw err
    }
  }
}

const batchSize = 100
let previousFailure: string | undefined

export async function processMeasurementsFromQueue(processMessage: (data: Buffer) => Promise<void>) {
  const len = await queue.xlen(args.measurementName)
  console.log(
    `Pulling measurement snapshots from queue with the name "${args.measurementName}" (configure with option --measurementName)`,
  )
  console.debug(`Queue has ${len} snapshots`)

  while (true) {
    const intervalPromise = new Promise((resolve) => setTimeout(resolve, args.pollingInterval))
    const range = await queue.xrangeBuffer(args.measurementName, '-', '+', 'COUNT', batchSize)
    try {
      await Promise.all([processRange(range, processMessage), intervalPromise])
      if (previousFailure) {
        console.info('Message processing operational again')
      }
      previousFailure = undefined
    } catch (err: unknown) {
      let message = 'unknown error'
      if (err instanceof Error) {
        message = err.message || 'unknown error'
      }
      if (previousFailure !== message) {
        console.error(err)
        console.error('Failed processing messages from redis, trying again')
        previousFailure = message
      }
    }
  }
}

export function getMeasurementSnapshot(): Record<string, RuuviMeasurement> {
  return Object.fromEntries(snapshot.entries())
}
