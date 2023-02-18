import { readArgs } from './lib/args'

const data = [
  'acceleration_x=-0.055,acceleration_y=-0.032,acceleration_z=0.998,battery_potential=3.007,humidity=19.5,pressure=101.481,temperature=19.63,movement_counter=1,measurement_sequence_number=1,tx_power=1',
  'acceleration_x=0.005,acceleration_y=0.015,acceleration_z=1.036,battery_potential=2.989,humidity=17.5,pressure=101.536,temperature=21.97,movement_counter=1,measurement_sequence_number=1,tx_power=1',
  'acceleration_x=0.002,acceleration_y=0.017,acceleration_z=1.032,battery_potential=2.977,humidity=17.5,pressure=101.536,temperature=21.97,movement_counter=1,measurement_sequence_number=1,tx_power=1',
  'acceleration_x=-0.052,acceleration_y=-0.032,acceleration_z=1,battery_potential=3.013,humidity=19.5,pressure=101.481,temperature=19.63,movement_counter=1,measurement_sequence_number=1,tx_power=1',
]

const macs = ['F7:2A:60:0D:6E:1E', 'F1:FC:AA:80:4E:59']

const { measurementName } = readArgs()

async function loop() {
  let i = 0
  while (true) {
    const line = data.at(i % data.length)
    const mac = macs.at(i % macs.length)
    i++
    const time = i
    process.stdout.write(`${measurementName},mac=${mac} ${line} ${time}\n`)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}

loop()
