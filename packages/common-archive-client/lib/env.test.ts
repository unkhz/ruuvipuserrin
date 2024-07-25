import { getEnv } from './env'

describe('getEnv', () => {
  it('should typify selected values', async () => {
    const env = {
      OTHER: 'stuff',
      ARCHIVE_API_SSL: '1',
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: '4000',
      ARCHIVE_API_PATH: '/trpc',
      ARCHIVE_API_CLIENT_ID: 'test.app',
      ARCHIVE_API_CLIENT_SECRET: '3214125',
    }
    expect(getEnv(env)).toEqual({
      ARCHIVE_API_SSL: true,
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: 4000,
      ARCHIVE_API_PATH: '/trpc',
      ARCHIVE_API_CLIENT_ID: 'test.app',
      ARCHIVE_API_CLIENT_SECRET: '3214125',
    })
  })

  it('should fail with wrong values', async () => {
    const env = {
      OTHER: 'stuff',
      ARCHIVE_API_SSL: '0',
      ARCHIVE_API_HOST: 92348176,
      ARCHIVE_API_PORT: '4000',
      ARCHIVE_API_CLIENT_ID: 'test.app',
      ARCHIVE_API_PATH: '/trpc',
    }
    expect(() =>
      // @ts-ignore
      getEnv(env),
    ).toThrow()
  })

  it('should NOT fail with missing optional values', async () => {
    const env = {
      ARCHIVE_API_SSL: '1',
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PATH: '',
    }
    expect(getEnv(env)).toEqual({
      ARCHIVE_API_SSL: true,
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PATH: '/trpc',
    })
  })
})
