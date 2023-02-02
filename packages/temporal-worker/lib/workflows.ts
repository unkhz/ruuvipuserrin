import { proxyActivities } from '@temporalio/workflow'
// Only import the activity types
import type * as activities from './activities'

const act = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
})

export function publishMeasurements(): Promise<string> {
  const data = await act.readMeasurements()

  // polish data (calibration, naming, aggregate)

  // push polished data to cloud

  return data
}
