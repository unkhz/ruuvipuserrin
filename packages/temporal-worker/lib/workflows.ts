import { scheduleActivity, scheduleLocalActivity } from '@temporalio/workflow'
// Only import the activity types
import type { readMeasurements, readArgs } from './activities'

export async function publishMeasurements() {
  const { pollingInterval } = await scheduleLocalActivity<ReturnType<typeof readArgs>>('readArgs', [], {
    // missing argument is non-retriable configuration error
    retry: { maximumAttempts: 1 },
    startToCloseTimeout: 1000,
  })

  const data = await scheduleActivity<ReturnType<typeof readMeasurements>>('readMeasurements', [], {
    startToCloseTimeout: pollingInterval,
  })

  // polish data (calibration, naming, aggregate)

  // push polished data to cloud

  return data
}