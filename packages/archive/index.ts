import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { createContext } from './lib/context.js'
import { getEnv } from './lib/env.js'
import { archiveApiRouter } from './lib/router.js'

export type { ArchiveApiRouter } from './lib/router.js'

const env = getEnv()

const app = express()
app.use(
  env.ARCHIVE_API_PATH ?? '/trpc',
  trpcExpress.createExpressMiddleware({
    router: archiveApiRouter,
    createContext,
  }),
)
app.use('/health', (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/plain',
    'X-Health-Check': 'OK',
  })
  res.send('OK')
  res.end()
})

const port = env.PORT ?? env.ARCHIVE_API_PORT ?? 8080
app.listen(port, () => {
  console.log(`tRPC server running in port ${port}`)
})
