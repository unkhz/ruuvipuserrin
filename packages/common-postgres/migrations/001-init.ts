import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('measurement')
    .addColumn('time', 'timestamptz', (col) => col.notNull())
    .addColumn('source', 'text', (col) => col.notNull())
    .addColumn('temperature', 'double precision', (col) => col.notNull())
    .addColumn('humidity', 'double precision', (col) => col.notNull())
    .addColumn('pressure', 'double precision', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('config')
    .addColumn('time', 'timestamptz', (col) => col.notNull())
    .addColumn('source', 'text', (col) => col.notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('shortname', 'varchar(8)', (col) => col.notNull())
    .execute()

  // Make hypertable
  await sql`
    SELECT create_hypertable('measurement','time');
  `.execute(db)

  await db.schema.createIndex('idx_measurement').on('measurement').columns(['source', 'time']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('measurement').execute()
  await db.schema.dropTable('config').execute()
}
