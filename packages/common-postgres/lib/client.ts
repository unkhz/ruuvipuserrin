import url from 'url'
import { Pool, PoolConfig } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

import { getEnv } from './env'
import { Database } from './database'

function getConfig(): PoolConfig {
  const env = getEnv()
  const { href: connectionString } = new url.URL(
    `postgres://${env.PG_USER}:${env.PG_PASSWORD}@${env.PG_HOST}:${env.PG_PORT}/${env.PG_DB}?sslmode=no-verify`,
  )

  return {
    connectionString,
    ssl: {
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
