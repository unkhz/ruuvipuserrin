import { afterEach, describe, expect, it, vi } from 'vitest'
import { createClient } from './client.js'
import * as env from './env.js'

vi.mock('pg', () => ({
  Pool: vi.fn(),
}))

describe('createClient', () => {
  it('should use env, create client and connect', async () => {
    vi.spyOn(env, 'getEnv').mockReturnValue({
      PG_HOST: 'localhost',
      PG_PORT: 0,
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCnRlc3QKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==',
    })
    const client = await createClient('test')
    expect(client).toBeDefined()
    expect(env.getEnv).toHaveBeenCalledTimes(1)
  })
})
