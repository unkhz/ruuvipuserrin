import { processMeasurementsFromQueue } from './lib/listen'
import { createServer } from './lib/serve'
export * from './lib/serve'

processMeasurementsFromQueue()

createServer().listen(2021, () => {
  console.log('listening on port 2021')
})
