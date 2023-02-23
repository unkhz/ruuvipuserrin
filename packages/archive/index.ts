import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { createContext } from './lib/context'
import { getEnv } from './lib/env'
import { archiveApiRouter } from './lib/router'

export type { ArchiveApiRouter } from './lib/router'

const env = getEnv()

const app = express()
app.use(
  env.ARCHIVE_API_PATH,
  trpcExpress.createExpressMiddleware({
    router: archiveApiRouter,
    createContext,
  }),
)

app.listen(env.ARCHIVE_API_PORT, env.ARCHIVE_API_HOST)
