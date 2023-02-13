import { createClient } from './client'
import * as env from './env'

jest.mock('pg')

describe('createClient', () => {
  it('should use env, create client and connect', async () => {
    jest.spyOn(env, 'getEnv').mockReturnValue({
      PG_HOST: 'localhost',
      PG_PORT: '0',
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCnRlc3QKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==',
    })
    const client = await createClient()
    expect(client).toBeDefined()
    expect(env.getEnv).toHaveBeenCalledTimes(1)
  })
})
