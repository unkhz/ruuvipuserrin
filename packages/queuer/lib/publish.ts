import { Redis } from 'ioredis'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'
import { readArgs } from './args'

const queue = new Redis({
  host: 'localhost',
  port: 6379,
})
queue.on('error', (err) => console.error(err))

const args = readArgs()

export async function pushMeasurementToQueue(data: RuuviMeasurement) {
  const encoded = RuuviMeasurement.encode(data).finish()
  queue.xaddBuffer(args.measurementName, '*', 'data', Buffer.from(encoded)).catch((err) => {
    console.error('Redis error', err)
  })
}
