import { Pool, PoolConfig } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { ZValidTenantId, ValidTenantId } from '@ruuvipuserrin/common-data'

import { getEnv } from './env'
import { Database } from './database'

function getConfig(tenantId: string): PoolConfig {
  const env = getEnv()
  return {
    host: env.PG_HOST,
    port: env.PG_PORT,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    database: `${env.PG_DB}-${tenantId}`,
    ssl: env.PG_CERT
      ? {
          requestCert: false,
          rejectUnauthorized: false,
          ca: env.PG_CERT,
        }
      : false,
    max: 5,
  }
}

export function createClient(tenantId: ValidTenantId): Kysely<Database> {
  const validatedTenantId = ZValidTenantId.parse(tenantId, {
    errorMap: () => new Error(`Invalid tenantId: ${tenantId}`),
  })
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(getConfig(validatedTenantId)),
    }),
  })
}
