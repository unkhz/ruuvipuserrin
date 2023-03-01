import * as trpcClient from '@trpc/client'

import { createClient } from './client'
import * as env from './env'

jest.mock('@trpc/client')

const testCredentials = {
  type: 'service_account',
  project_id: 'test',
  private_key_id: '1',
  private_key: '-----BEGIN PRIVATE KEY-----test-----END PRIVATE KEY-----',
  client_email: 'ding@dong.iam.gserviceaccount.com',
  client_id: '1234',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/ding%40dong.iam.gserviceaccount.com',
}

describe('createClient', () => {
  it('should use env, create client and connect', async () => {
    jest.spyOn(env, 'getEnv').mockReturnValue({
      ARCHIVE_API_HOST: 'localhost',
      ARCHIVE_API_PORT: 1234,
      ARCHIVE_API_PATH: '/teeärpeesee',
      ARCHIVE_API_SSL: true,
      ARCHIVE_CLIENT_GCLOUD_SCOPE: 'test.app',
      ARCHIVE_CLIENT_GCLOUD_CREDENTIALS: testCredentials,
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
