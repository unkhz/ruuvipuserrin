import { Redis } from 'ioredis'
import { RuuviMeasurement, RuuviMeasurementSnapshot } from '@ruuvipuserrin/common-data'
import { readArgs } from './args'

const queue = new Redis({
  host: 'localhost',
  port: 6379,
})
queue.on('error', (err) => console.error(err))

const args = readArgs()

const measurementCache: Map<string, RuuviMeasurement> = new Map()

export async function updateMeasurementSnapshot(data: RuuviMeasurement[]) {
  for (const item of data) {
    measurementCache.set(item.mac, item)
  }
}

export async function pushMeasurementSnapshotToQueue() {
  const measurements = Array.from(measurementCache.values())
  const encoded = RuuviMeasurementSnapshot.encode({
    time: Date.now(),
    measurements,
  }).finish()

  queue.xaddBuffer(args.measurementName, '*', 'data', Buffer.from(encoded)).catch((err) => {
    console.error('Redis error', err)
  })
}
