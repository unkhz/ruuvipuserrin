import { createWriteApi } from './write-api'
import * as env from './env'

describe('createWriteApi', () => {
  it('should use env', async () => {
    jest.spyOn(env, 'getEnv').mockReturnValue({
      INFLUX_BUCKET: 'bucket',
      INFLUX_ORG: 'org',
      INFLUX_TOKEN: 'token',
      INFLUX_URL: 'http://localhost',
    })
    expect(createWriteApi()).toBeDefined()
    expect(env.getEnv).toHaveBeenCalledTimes(1)
  })
})
