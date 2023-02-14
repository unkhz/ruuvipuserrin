import { processMeasurementsFromStandardInput } from './lib/listen'
import { pushMeasurementToQueue } from './lib/publish'

processMeasurementsFromStandardInput(pushMeasurementToQueue)
