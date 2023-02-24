import url from 'url'
import { Pool, PoolConfig } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

import { getEnv } from './env'
import { Database } from './database'

function getConfig(): PoolConfig {
  const env = getEnv()

  return {
    host: env.PG_HOST,
    port: env.PG_PORT,
    user: env.PG_USER,
    password: env.PG_PASSWORD,
    database: env.PG_DB,
    ssl: {
      requestCert: false,
      rejectUnauthorized: false,
      ca: env.PG_CERT,
    },
    max: 5,
  }
}

export function createClient(): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(getConfig()),
    }),
  })
}
