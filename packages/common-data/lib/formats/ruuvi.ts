/* eslint-disable */
import * as _m0 from 'protobufjs/minimal'

export const protobufPackage = ''

export interface RuuviMeasurement {
  accelerationX: number
  accelerationY: number
  accelerationZ: number
  batteryPotential: number
  humidity: number
  measurementSequenceNumber: number
  movementCounter: number
  pressure: number
  temperature: number
  txPower: number
  mac: string
  time: number
}

function createBaseRuuviMeasurement(): RuuviMeasurement {
  return {
    accelerationX: 0,
    accelerationY: 0,
    accelerationZ: 0,
    batteryPotential: 0,
    humidity: 0,
    measurementSequenceNumber: 0,
    movementCounter: 0,
    pressure: 0,
    temperature: 0,
    txPower: 0,
    mac: '',
    time: 0,
  }
}

export const RuuviMeasurement = {
  encode(message: RuuviMeasurement, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accelerationX !== 0) {
      writer.uint32(8).sint32(message.accelerationX)
    }
    if (message.accelerationY !== 0) {
      writer.uint32(16).sint32(message.accelerationY)
    }
    if (message.accelerationZ !== 0) {
      writer.uint32(24).sint32(message.accelerationZ)
    }
    if (message.batteryPotential !== 0) {
      writer.uint32(32).uint32(message.batteryPotential)
    }
    if (message.humidity !== 0) {
      writer.uint32(40).uint32(message.humidity)
    }
    if (message.measurementSequenceNumber !== 0) {
      writer.uint32(48).uint32(message.measurementSequenceNumber)
    }
    if (message.movementCounter !== 0) {
      writer.uint32(56).uint32(message.movementCounter)
    }
    if (message.pressure !== 0) {
      writer.uint32(64).uint32(message.pressure)
    }
    if (message.temperature !== 0) {
      writer.uint32(72).sint32(message.temperature)
    }
    if (message.txPower !== 0) {
      writer.uint32(80).uint32(message.txPower)
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
          message.accelerationX = reader.sint32()
          break
        case 2:
          message.accelerationY = reader.sint32()
          break
        case 3:
          message.accelerationZ = reader.sint32()
          break
        case 4:
          message.batteryPotential = reader.uint32()
          break
        case 5:
          message.humidity = reader.uint32()
          break
        case 6:
          message.measurementSequenceNumber = reader.uint32()
          break
        case 7:
          message.movementCounter = reader.uint32()
          break
        case 8:
          message.pressure = reader.uint32()
          break
        case 9:
          message.temperature = reader.sint32()
          break
        case 10:
          message.txPower = reader.uint32()
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
      accelerationX: isSet(object.accelerationX) ? Number(object.accelerationX) : 0,
      accelerationY: isSet(object.accelerationY) ? Number(object.accelerationY) : 0,
      accelerationZ: isSet(object.accelerationZ) ? Number(object.accelerationZ) : 0,
      batteryPotential: isSet(object.batteryPotential) ? Number(object.batteryPotential) : 0,
      humidity: isSet(object.humidity) ? Number(object.humidity) : 0,
      measurementSequenceNumber: isSet(object.measurementSequenceNumber) ? Number(object.measurementSequenceNumber) : 0,
      movementCounter: isSet(object.movementCounter) ? Number(object.movementCounter) : 0,
      pressure: isSet(object.pressure) ? Number(object.pressure) : 0,
      temperature: isSet(object.temperature) ? Number(object.temperature) : 0,
      txPower: isSet(object.txPower) ? Number(object.txPower) : 0,
      mac: isSet(object.mac) ? String(object.mac) : '',
      time: isSet(object.time) ? Number(object.time) : 0,
    }
  },

  toJSON(message: RuuviMeasurement): unknown {
    const obj: any = {}
    message.accelerationX !== undefined && (obj.accelerationX = Math.round(message.accelerationX))
    message.accelerationY !== undefined && (obj.accelerationY = Math.round(message.accelerationY))
    message.accelerationZ !== undefined && (obj.accelerationZ = Math.round(message.accelerationZ))
    message.batteryPotential !== undefined && (obj.batteryPotential = Math.round(message.batteryPotential))
    message.humidity !== undefined && (obj.humidity = Math.round(message.humidity))
    message.measurementSequenceNumber !== undefined &&
      (obj.measurementSequenceNumber = Math.round(message.measurementSequenceNumber))
    message.movementCounter !== undefined && (obj.movementCounter = Math.round(message.movementCounter))
    message.pressure !== undefined && (obj.pressure = Math.round(message.pressure))
    message.temperature !== undefined && (obj.temperature = Math.round(message.temperature))
    message.txPower !== undefined && (obj.txPower = Math.round(message.txPower))
    message.mac !== undefined && (obj.mac = message.mac)
    message.time !== undefined && (obj.time = message.time)
    return obj
  },

  create<I extends Exact<DeepPartial<RuuviMeasurement>, I>>(base?: I): RuuviMeasurement {
    return RuuviMeasurement.fromPartial(base ?? {})
  },

  fromPartial<I extends Exact<DeepPartial<RuuviMeasurement>, I>>(object: I): RuuviMeasurement {
    const message = createBaseRuuviMeasurement()
    message.accelerationX = object.accelerationX ?? 0
    message.accelerationY = object.accelerationY ?? 0
    message.accelerationZ = object.accelerationZ ?? 0
    message.batteryPotential = object.batteryPotential ?? 0
    message.humidity = object.humidity ?? 0
    message.measurementSequenceNumber = object.measurementSequenceNumber ?? 0
    message.movementCounter = object.movementCounter ?? 0
    message.pressure = object.pressure ?? 0
    message.temperature = object.temperature ?? 0
    message.txPower = object.txPower ?? 0
    message.mac = object.mac ?? ''
    message.time = object.time ?? 0
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
