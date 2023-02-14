import { RuuviMeasurement } from './ruuvi'

const exampleMeasurement = {
  accelerationX: 123,
  accelerationY: 123,
  accelerationZ: 123,
  batteryPotential: 123,
  humidity: 123,
  measurementSequenceNumber: 123,
  movementCounter: 123,
  pressure: 123,
  temperature: 123,
  txPower: 123,
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
    const { accelerationX, batteryPotential } = exampleMeasurement
    const typed = RuuviMeasurement.fromJSON({ accelerationX, batteryPotential })
    expect(typed).toEqual({
      accelerationX,
      batteryPotential,
      accelerationY: 0,
      accelerationZ: 0,
      humidity: 0,
      measurementSequenceNumber: 0,
      movementCounter: 0,
      pressure: 0,
      temperature: 0,
      txPower: 0,
      mac: '',
      time: 0,
    })
  })
})
