import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { ArchiveApiRouter } from '@ruuvipuserrin/archive'
import { getEnv } from './env'

const cache: Map<string, unknown> = new Map()

export async function fetchAuthHeaders() {
  const env = getEnv()
  return {
    'CF-Access-Client-Id': env.ARCHIVE_API_CLIENT_ID,
    'CF-Access-Client-Secret': env.ARCHIVE_API_CLIENT_SECRET,
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
        headers: async () => fetchAuthHeaders(),
      }),
    ],
  })
}
