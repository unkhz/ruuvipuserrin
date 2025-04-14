import { afterEach, describe, expect, it, vi } from 'vitest'
import { getEnv } from './env.js'

describe('getEnv', () => {
  it('should typify selected values', async () => {
    const env = {
      OTHER: 'stuff',
      PG_HOST: 'subdomain.localhost',
      PG_PORT: '25502',
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCnRlc3QKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==',
    }
    expect(getEnv(env)).toEqual({
      PG_HOST: 'subdomain.localhost',
      PG_PORT: 25502,
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: `-----BEGIN CERTIFICATE-----
test
-----END CERTIFICATE-----`,
    })
  })

  it('should fail with wrong values', async () => {
    const env = {
      PG_HOST: 'subdomain.localhost',
      PG_PORT: '25502',
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: 'not a base64 encoded cert',
    }
    expect(() =>
      // @ts-ignore
      getEnv(env),
    ).toThrow()
  })

  it('should NOT fail with optional missing values', async () => {
    const env = {
      PG_HOST: 'subdomain.localhost',
      PG_PORT: '25502',
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      // PG_CERT,
    }
    expect(getEnv(env)).toEqual({
      PG_HOST: 'subdomain.localhost',
      PG_PORT: 25502,
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: undefined,
    })
  })

  it('should fail with missing values', async () => {
    const env = {
      // PG_HOST: 'subdomain.localhost',
      PG_PORT: '25502',
      PG_USER: 'user',
      PG_PASSWORD: 'password',
      PG_DB: 'db',
      PG_CERT: 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCnRlc3QKLS0tLS1FTkQgQ0VSVElGSUNBVEUtLS0tLQ==',
    }
    expect(() =>
      // @ts-ignore
      getEnv(env),
    ).toThrow()
  })
})
