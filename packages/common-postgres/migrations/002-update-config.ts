import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .alterTable('config')
    .addColumn('listener', 'text', (col) => col.notNull())
    .addColumn('location', 'text', (col) => col.notNull())
    .execute()

  await db.schema.createIndex('idx_config').on('config').columns(['source', 'time']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('config').dropColumn('listener').dropColumn('location').execute()
  await db.schema.dropIndex('idx_config').on('config').execute()
}
