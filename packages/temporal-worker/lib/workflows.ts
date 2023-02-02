import { proxyActivities } from '@temporalio/workflow'
// Only import the activity types
import type * as activities from './activities'

const act = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
})

export function hello(): Promise<string> {
  return act.hello()
}
