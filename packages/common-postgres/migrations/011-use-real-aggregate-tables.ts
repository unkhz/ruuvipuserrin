import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>) {
  // Create aggregate tables
  await sql`
    CREATE TABLE ruuvi_measurement_1m (
      time timestamptz NOT NULL,
      source macaddr NOT NULL,
      temperature real NOT NULL,
      humidity real NOT NULL,
      pressure real NOT NULL,
      name text,
      shortname VARCHAR(8),
      location text
    )
  `.execute(db)

  await sql`
    SELECT create_hypertable('ruuvi_measurement_1m', 'time');
  `.execute(db)

  await sql`
    CREATE TABLE ruuvi_measurement_1h (
      time timestamptz NOT NULL,
      source macaddr NOT NULL,
      temperature real NOT NULL,
      humidity real NOT NULL,
      pressure real NOT NULL,
      name text,
      shortname VARCHAR(8),
      location text
    )
  `.execute(db)

  await sql`
    SELECT create_hypertable('ruuvi_measurement_1h', 'time');
  `.execute(db)

  // Create function to copy latest data to aggregate tables
  await sql`
    CREATE FUNCTION refresh_measurement_aggregates() RETURNS void AS $$
    DECLARE
      last_measurement timestamptz;
      last_measurement_1m timestamptz;
      last_measurement_1h timestamptz;
    BEGIN
      SELECT COALESCE(MAX(time), to_timestamp(0)) INTO last_measurement FROM ruuvi_measurement;
      SELECT COALESCE(MAX(time), to_timestamp(0)) INTO last_measurement_1m FROM ruuvi_measurement_1m;
      SELECT COALESCE(MAX(time), to_timestamp(0)) INTO last_measurement_1h FROM ruuvi_measurement_1h;

      IF last_measurement_1m IS NULL OR last_measurement - INTERVAL '1 minute' > last_measurement_1m
      THEN
        INSERT INTO ruuvi_measurement_1m (
          time,
          source,
          temperature,
          humidity,
          pressure,
          name,
          location
        )
        SELECT
          time_bucket('1 minute', m.time) AS _timeGroup,
          m.source,
          AVG(temperature),
          AVG(humidity),
          AVG(pressure),
          cc.name,
          cc.location
        FROM ruuvi_measurement AS m
        LEFT JOIN LATERAL (
          SELECT
            c.name,
            c.shortname,
            c.location
          FROM config AS c
          WHERE c.source = m.source AND c.time <= m.time
          ORDER BY c.time DESC
          LIMIT 1
        ) AS cc ON true
        WHERE time > last_measurement_1m
        GROUP BY _timeGroup, m.source, cc.name, cc.location;
      END IF;

      IF last_measurement_1h IS NULL OR last_measurement - INTERVAL '1 hour' > last_measurement_1h
      THEN
        INSERT INTO ruuvi_measurement_1h (
          time,
          source,
          temperature,
          humidity,
          pressure,
          name,
          location
        )
        SELECT
          time_bucket('1 hour', m.time) AS _timeGroup,
          m.source,
          AVG(temperature),
          AVG(humidity),
          AVG(pressure),
          cc.name,
          cc.location
        FROM ruuvi_measurement AS m
        LEFT JOIN LATERAL (
          SELECT
            c.name,
            c.shortname,
            c.location
          FROM config AS c
          WHERE c.source = m.source AND c.time <= m.time
          ORDER BY c.time DESC
          LIMIT 1
        ) AS cc ON true
        WHERE time > last_measurement_1h
        GROUP BY _timeGroup, m.source, cc.name, cc.location;
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `.execute(db)

  // Refresh aggregate tables
  await sql`
    SELECT refresh_measurement_aggregates();
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP FUNCTION refresh_measurement_aggregates;
  `.execute(db)
  await sql`
    DROP TABLE ruuvi_measurement_1m;
  `.execute(db)
  await sql`
    DROP TABLE ruuvi_measurement_1h;
  `.execute(db)
}
