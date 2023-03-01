import { getEnv } from './env'

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

const base64EncodedStringCredentials = Buffer.from(JSON.stringify(testCredentials)).toString('base64')

describe('getEnv', () => {
  it('should typify selected values', async () => {
    const env = {
      OTHER: 'stuff',
      ARCHIVE_API_SSL: '1',
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: '4000',
      ARCHIVE_API_PATH: '/trpc',
      ARCHIVE_CLIENT_GCLOUD_SCOPE: 'test.app',
      ARCHIVE_CLIENT_GCLOUD_CREDENTIALS: base64EncodedStringCredentials,
    }
    expect(getEnv(env)).toEqual({
      ARCHIVE_API_SSL: true,
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: 4000,
      ARCHIVE_API_PATH: '/trpc',
      ARCHIVE_CLIENT_GCLOUD_SCOPE: 'test.app',
      ARCHIVE_CLIENT_GCLOUD_CREDENTIALS: testCredentials,
    })
  })

  it('should fail with wrong values', async () => {
    const env = {
      OTHER: 'stuff',
      ARCHIVE_API_SSL: '0',
      ARCHIVE_API_HOST: 92348176,
      ARCHIVE_API_PORT: '4000',
      ARCHIVE_CLIENT_GCLOUD_SCOPE: 'test.app',
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
      ARCHIVE_API_PORT: '',
      ARCHIVE_API_PATH: '',
      ARCHIVE_CLIENT_GCLOUD_SCOPE: 'test.app',
      ARCHIVE_CLIENT_GCLOUD_CREDENTIALS: base64EncodedStringCredentials,
    }
    expect(getEnv(env)).toEqual({
      ARCHIVE_API_SSL: true,
      ARCHIVE_API_HOST: '127.0.0.1',
      ARCHIVE_API_PORT: 0,
      ARCHIVE_API_PATH: '/trpc',
      ARCHIVE_CLIENT_GCLOUD_SCOPE: 'test.app',
      ARCHIVE_CLIENT_GCLOUD_CREDENTIALS: testCredentials,
    })
  })
})
