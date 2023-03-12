import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  // Empty tables
  await sql`
    DELETE FROM ruuvi_measurement_aggregate_1m;
  `.execute(db)
  await sql`
    DELETE FROM ruuvi_measurement_aggregate_1h;
  `.execute(db)

  // Transform aggregate tables to hypertables
  await sql`
    SELECT create_hypertable('ruuvi_measurement_aggregate_1m', 'time');
  `.execute(db)
  await sql`
    SELECT create_hypertable('ruuvi_measurement_aggregate_1h', 'time');
  `.execute(db)

  // Refresh aggregates
  await sql`
    SELECT refresh_measurement_aggregates();
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {}
