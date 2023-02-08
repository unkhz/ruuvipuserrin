import pg from 'pg'
import url from 'url'
import { getEnv } from './env'

function getConfig() {
  const env = getEnv()
  const { href: connectionString } = new url.URL(
    `postgres://${env.PG_USER}:${env.PG_PASSWORD}@${env.PG_HOST}:${env.PG_PORT}/${env.PG_DB}?sslmode=require`,
  )

  return {
    connectionString,
    ssl: {
      rejectUnauthorized: true,
      ca: env.PG_CERT,
    },
  }
}

export async function createClient(): Promise<pg.Client> {
  const client = new pg.Client(getConfig())
  await client.connect()
  return client
}
