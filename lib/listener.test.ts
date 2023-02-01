import { describe, expect, it } from 'bun:test'
import { parseLineFromRuuvitagListener } from "./listener";

describe('parseLineFromRuuvitagListener', () => {
  it('should turn line into record', async () => {
    const input = 'measurement,mac=AA:BB:CC:DD:EE:FF,name=AA:BB:CC:DD:EE:FF acceleration_x=-0.824,acceleration_y=0.536,acceleration_z=-0.06,battery_potential=2.293,humidity=30.69,measurement_sequence_number=61523,movement_counter=97,pressure=98.971,temperature=20.35,tx_power=4 1675240931484835946'
    expect(parseLineFromRuuvitagListener(input)).toEqual({
      id: "aabbccddeeff",
      mac: "AA:BB:CC:DD:EE:FF",
      data: {
        acceleration_x: -0.824,
        acceleration_y: 0.536,
        acceleration_z: -0.06,
        battery_potential: 2.293,
        humidity: 30.69,
        measurement_sequence_number: 61523,
        movement_counter: 97,
        pressure: 98.971,
        temperature: 20.35,
        tx_power: 4
      },
      time: 1675240931484835800
    })
  })
})
