import { z } from 'zod'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'

export const ZRuuvitagMeasurement = z.object({
  acceleration_x: z.number(),
  acceleration_y: z.number(),
  acceleration_z: z.number(),
  battery_potential: z.number(),
  humidity: z.number(),
  measurement_sequence_number: z.number(),
  movement_counter: z.number(),
  pressure: z.number(),
  temperature: z.number(),
  tx_power: z.number(),
  mac: z.string().length(17),
  time: z.number(),
})

const ZRuuviMeasurementDataFromParsedInput = z.object({
  acceleration_x: z.coerce.number(),
  acceleration_y: z.coerce.number(),
  acceleration_z: z.coerce.number(),
  battery_potential: z.coerce.number(),
  humidity: z.coerce.number(),
  measurement_sequence_number: z.preprocess((value: unknown) => {
    const numberValue = Number(value)
    isNaN(numberValue) ? -1 : numberValue
  }, z.string()),
  movement_counter: z.coerce.number(),
  pressure: z.coerce.number(),
  temperature: z.coerce.number(),
  tx_power: z.coerce.number(),
})

const ZRuuvitagIdentifiersFromParsedInput = z.object({
  mac: z.string(),
})

function parseKeyValueCsv<TData extends Record<string, unknown>>(line: string): Record<keyof TData, string> {
  const pairs = line.split(',')
  return Object.fromEntries(pairs.map((pair) => pair.split('=')))
}

export function parseLineFromRuuvitagListener(line: string): RuuviMeasurement {
  const [identifiers, data, time] = line.split(' ')
  const { mac } = ZRuuvitagIdentifiersFromParsedInput.parse(parseKeyValueCsv<{ mac: string }>(identifiers))
  const parsedData = ZRuuviMeasurementDataFromParsedInput.parse(
    parseKeyValueCsv<z.infer<typeof ZRuuviMeasurementDataFromParsedInput>>(data),
  )
  return {
    ...parsedData,
    mac,
    time: z.coerce.number().parse(time),
  }
}
