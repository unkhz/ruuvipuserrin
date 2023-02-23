import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  sql`CREATE EXTENSION IF NOT EXISTS timescaledb;`.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  sql`DROP EXTENSION timescaledb;`.execute(db)
}
