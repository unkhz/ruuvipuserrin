import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  // Add new table for measurements
  await sql`
    CREATE TABLE ruuvi_measurement (
      time timestamptz NOT NULL,
      source macaddr NOT NULL,
      temperature real NOT NULL,
      humidity real NOT NULL,
      pressure real NOT NULL
    );
  `.execute(db)

  await sql`SELECT create_hypertable('ruuvi_measurement','time');`.execute(db)
  await db.schema.createIndex('idx_ruuvi_measurement').on('ruuvi_measurement').columns(['source', 'time']).execute()

  // Migrate data from old table to new
  await sql`
    INSERT INTO ruuvi_measurement (
      time,
      source,
      temperature,
      humidity,
      pressure
    )
    SELECT
      time,
      source::macaddr,
      temperature,
      humidity,
      pressure
    FROM measurement;
  `.execute(db)

  // Recreate source view
  await sql`
    DROP VIEW source;
  `.execute(db)

  await sql`
    CREATE VIEW source AS
    SELECT DISTINCT source FROM ruuvi_measurement;
  `.execute(db)

  // Drop old table
  await sql`
    DROP TABLE measurement;
  `.execute(db)

  // Refactor source to macaddr on config table as well
  await sql`
    ALTER TABLE config ALTER COLUMN source TYPE macaddr USING source::macaddr;
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('measurement')
    .addColumn('time', 'timestamptz', (col) => col.notNull())
    .addColumn('source', 'text', (col) => col.notNull())
    .addColumn('temperature', 'double precision', (col) => col.notNull())
    .addColumn('humidity', 'double precision', (col) => col.notNull())
    .addColumn('pressure', 'double precision', (col) => col.notNull())
    .execute()

  await sql`SELECT create_hypertable('measurement','time');`.execute(db)
  await db.schema.createIndex('idx_measurement').on('measurement').columns(['source', 'time']).execute()

  // Migrate data from old table to new
  await sql`
    INSERT INTO measurement (
      time,
      source,
      temperature,
      humidity,
      pressure
    )
    SELECT
      time,
      source::text,
      temperature,
      humidity,
      pressure
    FROM ruuvi_measurement;
  `.execute(db)

  // Recreate source view
  await sql`
    DROP VIEW source;
  `.execute(db)

  await sql`
    CREATE VIEW source AS
    SELECT DISTINCT source FROM measurement;
  `.execute(db)

  // Drop old table
  await sql`
    DROP TABLE ruuvi_measurement;
  `.execute(db)

  // Refactor source back to text on config table as well
  await sql`
    ALTER TABLE config ALTER COLUMN source TYPE text USING source::text;
  `.execute(db)
}
