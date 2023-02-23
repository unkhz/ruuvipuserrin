import * as trpcClient from '@trpc/client'

import { createClient } from './client'
import * as env from './env'

describe('createClient', () => {
  it('should use env, create client and connect', async () => {
    jest.spyOn(env, 'getEnv').mockReturnValue({
      ARCHIVE_API_HOST: 'localhost',
      ARCHIVE_API_PORT: 1234,
      ARCHIVE_API_PATH: '/teeärpeesee',
      ARCHIVE_API_SSL: true,
    })
    jest.spyOn(trpcClient, 'createTRPCProxyClient')
    jest.spyOn(trpcClient, 'httpBatchLink').mock

    createClient()

    expect(trpcClient.createTRPCProxyClient).toHaveBeenCalledTimes(1)
    expect(trpcClient.httpBatchLink).toHaveBeenCalledWith({
      url: 'https://localhost:1234/teeärpeesee',
    })
    expect(env.getEnv).toHaveBeenCalledTimes(1)
  })
})
