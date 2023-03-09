import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  // Create function to refresh materialized views for downsampled data in case they are stale
  await sql`
    CREATE OR REPLACE FUNCTION refresh_materialized_views() RETURNS void AS $$
    DECLARE
      last_measurement timestamptz;
    BEGIN
      SELECT MAX(time) INTO last_measurement FROM ruuvi_measurement;
      IF (
        SELECT last_measurement - INTERVAL '1 minute' > MAX(time)
        FROM ruuvi_measurement_1m
      )
      THEN
        REFRESH MATERIALIZED VIEW ruuvi_measurement_1m;
      END IF;

      IF (
        SELECT last_measurement - INTERVAL '1 hour' > MAX(time)
        FROM ruuvi_measurement_1h
      )
      THEN
        REFRESH MATERIALIZED VIEW ruuvi_measurement_1h;
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP FUNCTION IF EXISTS refresh_materialized_views;
  `.execute(db)
}
