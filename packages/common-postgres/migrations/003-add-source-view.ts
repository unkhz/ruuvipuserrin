import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema.createView('source').as(db.selectFrom('measurement').select('source').distinct()).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropView('source').execute()
}
