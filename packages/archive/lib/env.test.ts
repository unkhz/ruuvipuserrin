import { afterEach, describe, expect, it, vi } from 'vitest'
import { getEnv } from './env.js'

describe('getEnv', () => {
  it('should typify selected values', async () => {
    const env = {
      OTHER: 'stuff',
      ARCHIVE_API_SSL: '1',
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: '4000',
      ARCHIVE_API_PATH: '/trpc',
    }
    expect(getEnv(env)).toEqual({
      ARCHIVE_API_SSL: true,
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: 4000,
      ARCHIVE_API_PATH: '/trpc',
    })
  })

  it('should fail with wrong values', async () => {
    const env = {
      OTHER: 'stuff',
      ARCHIVE_API_SSL: '0',
      ARCHIVE_API_HOST: 92348176,
      ARCHIVE_API_PORT: '4000',
      ARCHIVE_API_PATH: '/trpc',
    }
    expect(() =>
      // @ts-ignore
      getEnv(env),
    ).toThrow()
  })
})
