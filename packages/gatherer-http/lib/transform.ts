import { z } from 'zod'
import { RuuviMeasurement } from '@ruuvipuserrin/common-data'

const ZRuuviMeasurementFromRuuviStation = z.object({
  tags: z.array(
    z.object({
      accelX: z.number(),
      accelY: z.number(),
      accelZ: z.number(),
      connectable: z.boolean(),
      createDate: z.string(),
      dataFormat: z.number(),
      favorite: z.boolean(),
      humidity: z.number(),
      humidityOffset: z.number(),
      id: z.string(),
      measurementSequenceNumber: z.number(),
      movementCounter: z.number(),
      name: z.string(),
      pressure: z.number(),
      pressureOffset: z.number(),
      rssi: z.number(),
      temperature: z.number(),
      temperatureOffset: z.number(),
      txPower: z.number(),
      updateAt: z.string(),
      voltage: z.number(),
    }),
  ),
  batteryLevel: z.number(),
  deviceId: z.string(),
  eventId: z.string(),
  time: z.string(),
})

export type RuuviMeasurementFromRuuviStation = z.infer<typeof ZRuuviMeasurementFromRuuviStation>

export function transformSnapshotFromRuuviStation(data: RuuviMeasurementFromRuuviStation): RuuviMeasurement[] {
  const parsedData = ZRuuviMeasurementFromRuuviStation.parse(data)

  return parsedData.tags.map((tag) => ({
    mac: tag.id,
    acceleration_x: tag.accelX,
    acceleration_y: tag.accelY,
    acceleration_z: tag.accelZ,
    battery_potential: tag.voltage,
    measurement_sequence_number: tag.measurementSequenceNumber,
    movement_counter: tag.movementCounter,
    tx_power: tag.txPower,
    temperature: tag.temperature,
    humidity: tag.humidity,
    pressure: tag.pressure,
    time: new Date(tag.updateAt).getTime() * 1000,
  }))
}
