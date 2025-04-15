import { Pool } from 'pg'
import type { PoolConfig } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { ZValidTenantId } from '@ruuvipuserrin/common-data'
import type { ValidTenantId } from '@ruuvipuserrin/common-data'

import { getEnv } from './env.js'
import type { Database } from './database.js'

function getConfig(tenantId: string): PoolConfig {
  const env = getEnv()
  return {
    host: env.PG_HOST,
    port: env.PG_PORT,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    database: `${env.PG_DB}_${tenantId}`,
    ssl: env.PG_CERT
      ? {
          requestCert: false,
          rejectUnauthorized: false,
          ca: env.PG_CERT,
        }
      : undefined,
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
