/* eslint-disable */
import * as _m0 from 'protobufjs/minimal'

export const protobufPackage = ''

export interface RuuviMeasurement {
  acceleration_x: number
  acceleration_y: number
  acceleration_z: number
  battery_potential: number
  humidity: number
  measurement_sequence_number: number
  movement_counter: number
  pressure: number
  temperature: number
  tx_power: number
  mac: string
  time: number
}

export interface RuuviMeasurementSnapshot {
  time: number
  measurements: RuuviMeasurement[]
}

function createBaseRuuviMeasurement(): RuuviMeasurement {
  return {
    acceleration_x: 0,
    acceleration_y: 0,
    acceleration_z: 0,
    battery_potential: 0,
    humidity: 0,
    measurement_sequence_number: 0,
    movement_counter: 0,
    pressure: 0,
    temperature: 0,
    tx_power: 0,
    mac: '',
    time: 0,
  }
}

export const RuuviMeasurement = {
  encode(message: RuuviMeasurement, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.acceleration_x !== 0) {
      writer.uint32(9).double(message.acceleration_x)
    }
    if (message.acceleration_y !== 0) {
      writer.uint32(17).double(message.acceleration_y)
    }
    if (message.acceleration_z !== 0) {
      writer.uint32(25).double(message.acceleration_z)
    }
    if (message.battery_potential !== 0) {
      writer.uint32(33).double(message.battery_potential)
    }
    if (message.humidity !== 0) {
      writer.uint32(41).double(message.humidity)
    }
    if (message.measurement_sequence_number !== 0) {
      writer.uint32(48).uint32(message.measurement_sequence_number)
    }
    if (message.movement_counter !== 0) {
      writer.uint32(56).uint32(message.movement_counter)
    }
    if (message.pressure !== 0) {
      writer.uint32(65).double(message.pressure)
    }
    if (message.temperature !== 0) {
      writer.uint32(73).double(message.temperature)
    }
    if (message.tx_power !== 0) {
      writer.uint32(80).uint32(message.tx_power)
    }
    if (message.mac !== '') {
      writer.uint32(90).string(message.mac)
    }
    if (message.time !== 0) {
      writer.uint32(97).double(message.time)
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RuuviMeasurement {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseRuuviMeasurement()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.acceleration_x = reader.double()
          break
        case 2:
          message.acceleration_y = reader.double()
          break
        case 3:
          message.acceleration_z = reader.double()
          break
        case 4:
          message.battery_potential = reader.double()
          break
        case 5:
          message.humidity = reader.double()
          break
        case 6:
          message.measurement_sequence_number = reader.uint32()
          break
        case 7:
          message.movement_counter = reader.uint32()
          break
        case 8:
          message.pressure = reader.double()
          break
        case 9:
          message.temperature = reader.double()
          break
        case 10:
          message.tx_power = reader.uint32()
          break
        case 11:
          message.mac = reader.string()
          break
        case 12:
          message.time = reader.double()
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): RuuviMeasurement {
    return {
      acceleration_x: isSet(object.acceleration_x) ? Number(object.acceleration_x) : 0,
      acceleration_y: isSet(object.acceleration_y) ? Number(object.acceleration_y) : 0,
      acceleration_z: isSet(object.acceleration_z) ? Number(object.acceleration_z) : 0,
      battery_potential: isSet(object.battery_potential) ? Number(object.battery_potential) : 0,
      humidity: isSet(object.humidity) ? Number(object.humidity) : 0,
      measurement_sequence_number: isSet(object.measurement_sequence_number)
        ? Number(object.measurement_sequence_number)
        : 0,
      movement_counter: isSet(object.movement_counter) ? Number(object.movement_counter) : 0,
      pressure: isSet(object.pressure) ? Number(object.pressure) : 0,
      temperature: isSet(object.temperature) ? Number(object.temperature) : 0,
      tx_power: isSet(object.tx_power) ? Number(object.tx_power) : 0,
      mac: isSet(object.mac) ? String(object.mac) : '',
      time: isSet(object.time) ? Number(object.time) : 0,
    }
  },

  toJSON(message: RuuviMeasurement): unknown {
    const obj: any = {}
    message.acceleration_x !== undefined && (obj.acceleration_x = message.acceleration_x)
    message.acceleration_y !== undefined && (obj.acceleration_y = message.acceleration_y)
    message.acceleration_z !== undefined && (obj.acceleration_z = message.acceleration_z)
    message.battery_potential !== undefined && (obj.battery_potential = message.battery_potential)
    message.humidity !== undefined && (obj.humidity = message.humidity)
    message.measurement_sequence_number !== undefined &&
      (obj.measurement_sequence_number = Math.round(message.measurement_sequence_number))
    message.movement_counter !== undefined && (obj.movement_counter = Math.round(message.movement_counter))
    message.pressure !== undefined && (obj.pressure = message.pressure)
    message.temperature !== undefined && (obj.temperature = message.temperature)
    message.tx_power !== undefined && (obj.tx_power = Math.round(message.tx_power))
    message.mac !== undefined && (obj.mac = message.mac)
    message.time !== undefined && (obj.time = message.time)
    return obj
  },

  create<I extends Exact<DeepPartial<RuuviMeasurement>, I>>(base?: I): RuuviMeasurement {
    return RuuviMeasurement.fromPartial(base ?? {})
  },

  fromPartial<I extends Exact<DeepPartial<RuuviMeasurement>, I>>(object: I): RuuviMeasurement {
    const message = createBaseRuuviMeasurement()
    message.acceleration_x = object.acceleration_x ?? 0
    message.acceleration_y = object.acceleration_y ?? 0
    message.acceleration_z = object.acceleration_z ?? 0
    message.battery_potential = object.battery_potential ?? 0
    message.humidity = object.humidity ?? 0
    message.measurement_sequence_number = object.measurement_sequence_number ?? 0
    message.movement_counter = object.movement_counter ?? 0
    message.pressure = object.pressure ?? 0
    message.temperature = object.temperature ?? 0
    message.tx_power = object.tx_power ?? 0
    message.mac = object.mac ?? ''
    message.time = object.time ?? 0
    return message
  },
}

function createBaseRuuviMeasurementSnapshot(): RuuviMeasurementSnapshot {
  return { time: 0, measurements: [] }
}

export const RuuviMeasurementSnapshot = {
  encode(message: RuuviMeasurementSnapshot, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.time !== 0) {
      writer.uint32(9).double(message.time)
    }
    for (const v of message.measurements) {
      RuuviMeasurement.encode(v!, writer.uint32(18).fork()).ldelim()
    }
    return writer
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RuuviMeasurementSnapshot {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input)
    let end = length === undefined ? reader.len : reader.pos + length
    const message = createBaseRuuviMeasurementSnapshot()
    while (reader.pos < end) {
      const tag = reader.uint32()
      switch (tag >>> 3) {
        case 1:
          message.time = reader.double()
          break
        case 2:
          message.measurements.push(RuuviMeasurement.decode(reader, reader.uint32()))
          break
        default:
          reader.skipType(tag & 7)
          break
      }
    }
    return message
  },

  fromJSON(object: any): RuuviMeasurementSnapshot {
    return {
      time: isSet(object.time) ? Number(object.time) : 0,
      measurements: Array.isArray(object?.measurements)
        ? object.measurements.map((e: any) => RuuviMeasurement.fromJSON(e))
        : [],
    }
  },

  toJSON(message: RuuviMeasurementSnapshot): unknown {
    const obj: any = {}
    message.time !== undefined && (obj.time = message.time)
    if (message.measurements) {
      obj.measurements = message.measurements.map((e) => (e ? RuuviMeasurement.toJSON(e) : undefined))
    } else {
      obj.measurements = []
    }
    return obj
  },

  create<I extends Exact<DeepPartial<RuuviMeasurementSnapshot>, I>>(base?: I): RuuviMeasurementSnapshot {
    return RuuviMeasurementSnapshot.fromPartial(base ?? {})
  },

  fromPartial<I extends Exact<DeepPartial<RuuviMeasurementSnapshot>, I>>(object: I): RuuviMeasurementSnapshot {
    const message = createBaseRuuviMeasurementSnapshot()
    message.time = object.time ?? 0
    message.measurements = object.measurements?.map((e) => RuuviMeasurement.fromPartial(e)) || []
    return message
  },
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>

type KeysOfUnion<T> = T extends T ? keyof T : never
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never }

function isSet(value: any): boolean {
  return value !== null && value !== undefined
}
