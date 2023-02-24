import { inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { createClient } from '@ruuvipuserrin/common-postgres'

const db = createClient()

export function createContext({ req, res }: CreateExpressContextOptions) {
  return { req, res, db }
}

export type Context = inferAsyncReturnType<typeof createContext>
