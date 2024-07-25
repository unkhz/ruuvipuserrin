import * as trpcClient from '@trpc/client'

import { createClient } from './client'
import * as env from './env'

jest.mock('@trpc/client')

describe('createClient', () => {
  it('should use env, create client and connect', async () => {
    jest.spyOn(env, 'getEnv').mockReturnValue({
      ARCHIVE_API_HOST: 'localhost',
      ARCHIVE_API_PORT: 1234,
      ARCHIVE_API_PATH: '/teeärpeesee',
      ARCHIVE_API_SSL: true,
      ARCHIVE_API_CLIENT_ID: 'test.app',
      ARCHIVE_API_CLIENT_SECRET: '12345',
    })

    createClient()

    expect(trpcClient.createTRPCProxyClient).toHaveBeenCalledTimes(1)
    expect(trpcClient.httpBatchLink).toHaveBeenCalledWith({
      url: 'https://localhost:1234/teeärpeesee',
      headers: expect.any(Function),
    })
    expect(env.getEnv).toHaveBeenCalledTimes(1)
  })
})
