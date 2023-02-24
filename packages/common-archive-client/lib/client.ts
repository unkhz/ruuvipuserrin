import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { ArchiveApiRouter } from '@ruuvipuserrin/archive'
import { getEnv } from './env'

export function createClient() {
  const { ARCHIVE_API_SSL, ARCHIVE_API_HOST, ARCHIVE_API_PORT, ARCHIVE_API_PATH } = getEnv()
  const protocol = ARCHIVE_API_SSL ? 'https://' : 'http://'
  const port = ARCHIVE_API_PORT ? `:${ARCHIVE_API_PORT}` : ''
  const url = `${protocol}${ARCHIVE_API_HOST}${port}${ARCHIVE_API_PATH}`
  return createTRPCProxyClient<ArchiveApiRouter>({
    links: [
      httpBatchLink({
        url,
      }),
    ],
  })
}
