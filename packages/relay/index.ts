import { processMeasurementsFromStandardInput } from './lib/listener'
import { createServer } from './lib/server'
export * from './lib/server'

processMeasurementsFromStandardInput()

createServer().listen(2021, () => {
  console.log('listening on port 2021')
})
