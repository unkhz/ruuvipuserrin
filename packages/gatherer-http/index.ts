import { readArgs } from './lib/args.js'
import { transformSnapshotFromRuuviStation, RuuviMeasurementFromRuuviStation } from './lib/transform.js'
import { pushMeasurementSnapshotToQueue, updateMeasurementSnapshot } from './lib/queue-write.js'

async function periodicallyPublishSnapshot() {
  const { pollingInterval, measurementName } = readArgs()

  console.log(
    `HTTP Gatherer started. Pushing measurement snapshot to queue "${measurementName}" every ${pollingInterval} ms`,
  )

  while (true) {
    const intervalPromise: Promise<void> = new Promise((resolve) => setTimeout(() => resolve(), pollingInterval))
    await Promise.all([pushMeasurementSnapshotToQueue(), intervalPromise])
  }
}

periodicallyPublishSnapshot().catch((err) => {
  console.error(err)
  process.exit(1)
})

const args = readArgs()

Bun.serve({
  port: args.port,
  async fetch(request) {
    const snapshotFromRuuviStation = await request.json<RuuviMeasurementFromRuuviStation>()
    updateMeasurementSnapshot(transformSnapshotFromRuuviStation(snapshotFromRuuviStation))
    return Response.json()
  },
})
