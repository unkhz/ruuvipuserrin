import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  // Store health data in a separate table, to allow different downsampling strategy
  await sql`
    CREATE TABLE ruuvi_health (
      time timestamptz NOT NULL,
      source macaddr NOT NULL,
      tx_power smallint NOT NULL,
      battery_potential smallint NOT NULL,
      movement_counter smallint NOT NULL
    );
  `.execute(db)

  await sql`SELECT create_hypertable('ruuvi_health','time');`.execute(db)
  await db.schema.createIndex('idx_ruuvi_health').on('ruuvi_health').columns(['source', 'time']).execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  // Store health data in a separate table, to allow different downsampling strategy
  await sql`
    DROP TABLE ruuvi_health;
  `.execute(db)
}
