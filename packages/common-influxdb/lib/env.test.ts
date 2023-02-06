import { getEnv } from './env'

describe('getEnv', () => {
  it('should typify selected values', async () => {
    const env = {
      OTHER: 'stuff',
      INFLUX_BUCKET: 'bucket',
      INFLUX_ORG: 'org',
      INFLUX_TOKEN: 'token',
      INFLUX_URL: 'url',
    }
    expect(getEnv(env)).toEqual({
      INFLUX_BUCKET: 'bucket',
      INFLUX_ORG: 'org',
      INFLUX_TOKEN: 'token',
      INFLUX_URL: 'url',
    })
  })

  it('should fail with missing and wrong values', async () => {
    const env = {
      INFLUX_BUCKET: null,
      INFLUX_ORG: 1,
      INFLUX_TOKEN: ['token'],
      // INFLUX_URL,
    }
    expect(() =>
      // @ts-ignore
      getEnv(env),
    ).toThrow()
  })
})
