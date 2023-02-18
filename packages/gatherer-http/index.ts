import { readArgs } from './lib/args'
import { processMeasurementsFromStandardInput } from './lib/listener-read'
import { pushMeasurementSnapshotToQueue, updateMeasurementSnapshot } from './lib/queue-write'

async function periodicallyPublishSnapshot() {
  const { pollingInterval } = readArgs()

  console.log(`HTTP Gatherer started. Pushing measurement snapshot to queue every ${pollingInterval} ms`)

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
    console.log(await request.json())
    return Response.json()
  },
})
