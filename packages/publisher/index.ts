import { Connection, Client } from '@temporalio/client'
import { hello } from '@ruuvipuserrin/temporal-worker/lib/workflows'

async function run() {
  // Connect to the default Server location (localhost:7233)
  const connection = await Connection.connect()

  const client = new Client({
    connection,
    // namespace: 'foo.bar', // connects to 'default' namespace if not specified
  })

  const pollingInterval = 15000

  console.log(`Scheduler started. Running publish every ${pollingInterval} ms`)

  while (true) {
    const intervalPromise: Promise<void> = new Promise((resolve) => setTimeout(() => resolve(), pollingInterval))
    client.workflow.start(hello, {
      args: [],
      taskQueue: 'ruuvipuserrin',
      workflowId: `publish-${new Date().getTime()}`,
    })
    await intervalPromise
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
