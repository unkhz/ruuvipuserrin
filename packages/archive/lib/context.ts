import { inferAsyncReturnType } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { createClient, migrateToLatest, ValidTenantId } from '@ruuvipuserrin/common-postgres'

const clients = new Map<ValidTenantId, Promise<ReturnType<typeof createClient>>>()

async function createClientAndRunMigrations(tenantId: ValidTenantId) {
  console.log('connecting new db client for tenant', tenantId)
  const db = createClient(tenantId)
  await migrateToLatest(db).catch((err) => {
    clients.delete(tenantId)
    throw err
  })
  return db
}

async function dbForTenant(tenantId: ValidTenantId) {
  const promiseForExistingClient = clients.get(tenantId)
  if (promiseForExistingClient) {
    return promiseForExistingClient
  }

  const promiseForNewClient = createClientAndRunMigrations(tenantId)
  clients.set(tenantId, promiseForNewClient)
  return promiseForNewClient
}

export function createContext({ req, res }: CreateExpressContextOptions) {
  return { req, res, dbForTenant }
}

export type Context = inferAsyncReturnType<typeof createContext>
