import { z } from 'zod'

export const ZRuuvitagMeasurementData = z.object({
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
})

export const ZRuuvitagMeasurement = z.object({
  id: z.string().length(12),
  mac: z.string().length(17),
  data: ZRuuvitagMeasurementData,
  time: z.number(),
})

const ZRuuvitagMeasurementDataFromParsedInput = z.object({
  acceleration_x: z.coerce.number(),
  acceleration_y: z.coerce.number(),
  acceleration_z: z.coerce.number(),
  battery_potential: z.coerce.number(),
  humidity: z.coerce.number(),
  measurement_sequence_number: z.coerce.number(),
  movement_counter: z.coerce.number(),
  pressure: z.coerce.number(),
  temperature: z.coerce.number(),
  tx_power: z.coerce.number(),
})

const ZRuuvitagIdentifiersFromParsedInput = z.object({
  mac: z.string(),
})

export type RuuvitagMeasurementData = z.infer<typeof ZRuuvitagMeasurementData>

export type RuuvitagMeasurement = z.infer<typeof ZRuuvitagMeasurement>

function parseKeyValueCsv<TData extends Record<string, unknown>>(line: string): Record<keyof TData, string> {
  const pairs = line.split(',')
  return Object.fromEntries(pairs.map((pair) => pair.split('=')))
}

export function parseLineFromRuuvitagListener(line: string): RuuvitagMeasurement {
  const [identifiers, data, time] = line.split(' ')
  const { mac } = ZRuuvitagIdentifiersFromParsedInput.parse(parseKeyValueCsv<{ mac: string }>(identifiers))
  return {
    id: mac.toLowerCase().replace(/:/g, ''),
    mac,
    data: ZRuuvitagMeasurementDataFromParsedInput.parse(parseKeyValueCsv<RuuvitagMeasurementData>(data)),
    time: z.coerce.number().parse(time),
  }
}
