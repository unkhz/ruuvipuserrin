
export type RuuvitagMeasurementData = {
  acceleration_x: string
  acceleration_y: string
  acceleration_z: string
  battery_potential: string
  humidity: string
  measurement_sequence_number: string
  movement_counter: string
  pressure: string
  temperature: string
  tx_power: string
}

export type RuuvitagMeasurement = {
  id: string
  mac: string
  data: RuuvitagMeasurementData
  time: number
}


function parseKeyValueCsv<TData extends Record<string, string>>(line: string): Record<keyof TData, string> {
  const pairs = line.split(',')
  return Object.fromEntries(pairs.map(pair => pair.split('=')))
}

export function parseLineFromRuuvitagListener(line: string): RuuvitagMeasurement {
  const [identifiers, data, time] = line.split(' ')
  const {mac} = parseKeyValueCsv<{mac: string}>(identifiers)
  return {
    id: mac.toLowerCase().replace(/:/g, ''),
    mac,
    data: parseKeyValueCsv<RuuvitagMeasurementData>(data),
    time: Number(time)
  }
}