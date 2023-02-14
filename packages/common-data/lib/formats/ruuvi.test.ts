import { RuuviMeasurement } from './ruuvi'

const exampleMeasurement = {
  acceleration_x: 123,
  acceleration_y: 123,
  acceleration_z: 123,
  battery_potential: 123,
  humidity: 123,
  measurement_sequence_number: 123,
  movement_counter: 123,
  pressure: 123,
  temperature: 123,
  tx_power: 123,
  mac: 'aa:bb:cc:dd:ee:ff',
  time: 123,
}

describe('RuuviMeasurement', () => {
  it('should encode and decode', () => {
    const encoded = RuuviMeasurement.encode(exampleMeasurement).finish()
    const decoded = RuuviMeasurement.decode(encoded)
    expect(decoded).toEqual(exampleMeasurement)
  })

  it('should toJSON', () => {
    const untyped = RuuviMeasurement.toJSON(exampleMeasurement)
    expect(untyped).toEqual(exampleMeasurement)
  })

  it('should fromJSON', () => {
    const typed = RuuviMeasurement.fromJSON(exampleMeasurement)
    expect(typed).toEqual(exampleMeasurement)
  })

  it('should fromPartial', () => {
    const { acceleration_x, battery_potential } = exampleMeasurement
    const typed = RuuviMeasurement.fromJSON({ acceleration_x, battery_potential })
    expect(typed).toEqual({
      acceleration_x,
      battery_potential,
      acceleration_y: 0,
      acceleration_z: 0,
      humidity: 0,
      measurement_sequence_number: 0,
      movement_counter: 0,
      pressure: 0,
      temperature: 0,
      tx_power: 0,
      mac: '',
      time: 0,
    })
  })
})
