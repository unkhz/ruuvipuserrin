import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { ArchiveApiRouter } from '@ruuvipuserrin/archive'
import { getEnv } from './env'

// TODO: consider storing in KV in case of cloudflare worker client
const cache: Map<string, unknown> = new Map()

export async function getAuthHeaders() {
  const env = getEnv()
  if (!env.ARCHIVE_CLIENT_GCLOUD_CREDENTIALS) {
    return {}
  }

  const { getAccessToken } = await import('web-auth-library/google')

  const accessToken = await getAccessToken({
    credentials: env.ARCHIVE_CLIENT_GCLOUD_CREDENTIALS,
    scope: env.ARCHIVE_CLIENT_GCLOUD_SCOPE,
    cache,
  })

  return {
    Authorization: `Bearer ${accessToken}`,
  }
}

export function createClient() {
  const { ARCHIVE_API_SSL, ARCHIVE_API_HOST, ARCHIVE_API_PORT, ARCHIVE_API_PATH } = getEnv()
  const protocol = ARCHIVE_API_SSL ? 'https://' : 'http://'
  const port = ARCHIVE_API_PORT ? `:${ARCHIVE_API_PORT}` : ''
  const url = `${protocol}${ARCHIVE_API_HOST}${port}${ARCHIVE_API_PATH}`
  console.log(`Connecting to tRPC api in ${url}`)

  return createTRPCProxyClient<ArchiveApiRouter>({
    links: [
      httpBatchLink({
        url,
        headers: async () => ({
          ...(await getAuthHeaders()),
        }),
      }),
    ],
  })
}
