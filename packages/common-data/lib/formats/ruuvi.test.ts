import { afterEach, describe, expect, it, vi } from 'vitest'
import { RuuviMeasurement, RuuviMeasurementSnapshot } from './ruuvi'

const exampleMeasurement = {
  acceleration_x: 123.456,
  acceleration_y: 123.456,
  acceleration_z: 123.456,
  battery_potential: 123.456,
  humidity: 123.456,
  measurement_sequence_number: 123,
  movement_counter: 123,
  pressure: 123.456,
  temperature: 123.456,
  tx_power: 123,
  mac: 'aa:bb:cc:dd:ee:ff',
  time: 123,
}

const exampleMeasurementSnapshot = {
  time: 123,
  measurements: [
    exampleMeasurement,
    { ...exampleMeasurement, mac: '11:22:33:44:55:66' },
    { ...exampleMeasurement, mac: '77:88:99:44:55:66' },
  ],
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
    const typed = RuuviMeasurement.fromPartial({ acceleration_x, battery_potential })
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

describe('RuuviMeasurementSnapshot', () => {
  it('should encode and decode', () => {
    const encoded = RuuviMeasurementSnapshot.encode(exampleMeasurementSnapshot).finish()
    const decoded = RuuviMeasurementSnapshot.decode(encoded)
    expect(decoded).toEqual(exampleMeasurementSnapshot)
  })

  it('should toJSON', () => {
    const untyped = RuuviMeasurementSnapshot.toJSON(exampleMeasurementSnapshot)
    expect(untyped).toEqual(exampleMeasurementSnapshot)
  })

  it('should fromJSON', () => {
    const typed = RuuviMeasurementSnapshot.fromJSON(exampleMeasurementSnapshot)
    expect(typed).toEqual(exampleMeasurementSnapshot)
  })

  it('should fromPartial', () => {
    const { acceleration_x, battery_potential } = exampleMeasurement
    const typed = RuuviMeasurementSnapshot.fromPartial({
      time: 123,
      measurements: [{ acceleration_x, battery_potential }],
    })
    expect(typed.measurements).toEqual([
      {
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
      },
    ])
  })
})
