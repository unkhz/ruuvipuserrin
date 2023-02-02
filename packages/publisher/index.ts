import { Connection, Client } from '@temporalio/client'
import { publishMeasurements } from '@ruuvipuserrin/temporal-worker/lib/workflows'
import { readArgs } from './lib/args'

async function run() {
  // Connect to the default Server location (localhost:7233)
  const connection = await Connection.connect()

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  })

  const { pollingInterval, taskQueue } = readArgs()

  console.log(`Scheduler started. Running publish every ${pollingInterval} ms`)

  while (true) {
    const intervalPromise: Promise<void> = new Promise((resolve) => setTimeout(() => resolve(), pollingInterval))
    client.workflow.start(publishMeasurements, {
      args: [],
      taskQueue,
      workflowId: `publish-${new Date().getTime()}`,
      workflowExecutionTimeout: pollingInterval,
    })
    await intervalPromise
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
