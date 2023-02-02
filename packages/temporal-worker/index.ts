import { Worker } from '@temporalio/worker'
import * as activities from './lib/activities'

async function run() {
  // Step 1: Register Workflows and Activities with the Worker and connect to the Temporal server.
  const worker = await Worker.create({
    workflowsPath: require.resolve('./lib/workflows'),
    activities,
    taskQueue: 'ruuvipuserrin',
    namespace: 'default',
    // address: 'http://localhost:7233',
  })

  // Worker connects to localhost by default and uses console.error for logging. Customize the Worker by passing more
  // options to create(): https://typescript.temporal.io/api/classes/worker.Worker If you need to configure server
  // connection parameters, see docs: https://docs.temporal.io/typescript/security#encryption-in-transit-with-mtls

  // Step 2: Start accepting tasks
  await worker.run()
}

run().catch((err) => {
  throw err
})
