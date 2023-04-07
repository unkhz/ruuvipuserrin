import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await sql`
    DROP FUNCTION refresh_measurement_aggregates;
  `.execute(db)

  // Create procedure to update name and location into aggregate table
  await sql`
    CREATE OR REPLACE PROCEDURE update_measurement_aggregate_name_and_location(aggregate_table_name text, start_timestamp timestamptz)
    LANGUAGE plpgsql AS
    $$
      BEGIN
      EXECUTE format('
        UPDATE %I AS a
        SET
          name = COALESCE(c.name, c.shortname),
          location = c.location
        FROM config AS c
        WHERE a.source = c.source
        AND a.time >= $1
        AND a.time <= c.time', aggregate_table_name)
      USING start_timestamp;
      END;
    $$;
  `.execute(db)

  // Create procedure to copy latest data to aggregate tables
  await sql`
    CREATE OR REPLACE PROCEDURE refresh_measurement_aggregate(aggregate_table_name text, interval_text text)
    LANGUAGE plpgsql AS
    $$
      DECLARE
        last_measurement timestamptz;
        last_measurement_aggregate timestamptz;
      BEGIN
        SELECT COALESCE(MAX(time), to_timestamp(0)) INTO last_measurement FROM ruuvi_measurement;
        EXECUTE format('SELECT COALESCE(MAX(time), to_timestamp(0)) INTO last_measurement_aggregate FROM %I', aggregate_table_name);

        IF last_measurement_aggregate IS NULL OR last_measurement - INTERVAL interval_text > last_measurement_aggregate
        THEN
          EXECUTE format('
            INSERT INTO %I (
              time,
              source,
              temperature,
              humidity,
              pressure
            )
            SELECT
              time_bucket(interval, time) AS time,
              source,
              AVG(temperature) AS temperature,
              AVG(humidity) AS humidity,
              AVG(pressure) AS pressure
            FROM ruuvi_measurement
            WHERE time > last_measurement_aggregate
            GROUP BY time_bucket(interval, time), source;
          ', aggregate_table_name);
        END IF;
      END;
    $$;
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {}
