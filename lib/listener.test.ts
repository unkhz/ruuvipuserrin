import { describe, expect, it } from 'bun:test'
import { ZodError } from 'zod'
import { parseLineFromRuuvitagListener } from "./listener";

type RuuvitagListenerOutputInput = {
  mac: string
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
  time: string
}

function createRuuvitagListenerOutput(input: Partial<RuuvitagListenerOutputInput>) {
  const {
    mac = 'AA:BB:CC:DD:EE:FF',
    acceleration_x = '-0.824',
    acceleration_y = '0.536',
    acceleration_z = '-0.06',
    battery_potential = '2.293',
    humidity = '30.69',
    measurement_sequence_number = '61523',
    movement_counter = '97',
    pressure = '98.971',
    temperature = '20.35',
    tx_power = '4',
    time = '1235'
  } = input
  return `measurement,mac=${mac},name=${mac} acceleration_x=${acceleration_x},acceleration_y=${acceleration_y},acceleration_z=${acceleration_z},battery_potential=${battery_potential},humidity=${humidity},measurement_sequence_number=${measurement_sequence_number},movement_counter=${movement_counter},pressure=${pressure},temperature=${temperature},tx_power=${tx_power} ${time}`
}

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

  const failureCases: {desc: string, input: string}[] = [
    {desc: 'missing mac', input: 'wrong'},
    {desc: 'non-numeric data value', input: createRuuvitagListenerOutput({acceleration_x: 'wrong'})},
    {desc: 'missing data value', input: createRuuvitagListenerOutput({tx_power: ''})},
  ]
  failureCases.forEach(({desc, input}) => {
    it(`should fail w/ ${desc}`, async () => {
      try {
        parseLineFromRuuvitagListener(input)
      } catch(error: unknown) {
        expect(error instanceof ZodError).toEqual(true)
        if (error instanceof ZodError) {
          expect(error.errors[0].code).toEqual('invalid_type')
        }
      }
    })
  })
})

