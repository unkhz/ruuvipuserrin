import { readArgs } from './lib/args.js'
import { processMeasurementsFromStandardInput } from './lib/listener-read.js'
import { pushMeasurementSnapshotToQueue, updateMeasurementSnapshot } from './lib/queue-write.js'

processMeasurementsFromStandardInput(updateMeasurementSnapshot).catch((err) => {
  console.error(err)
  process.exit(1)
})

async function periodicallyPublishSnapshot() {
  const { pollingInterval, measurementName } = readArgs()

  console.log(
    `STDIN Gatherer started. Pushing measurement snapshot to queue "${measurementName}" every ${pollingInterval} ms`,
  )

  while (true) {
    const intervalPromise: Promise<void> = new Promise((resolve) => setTimeout(() => resolve(), pollingInterval))
    await Promise.allSettled([pushMeasurementSnapshotToQueue(), intervalPromise])
  }
}

periodicallyPublishSnapshot().catch((err) => {
  console.error(err)
  process.exit(1)
})
