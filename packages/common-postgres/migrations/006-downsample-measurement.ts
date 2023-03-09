import { Kysely, sql } from 'kysely'

// Add materialized views for per-minute downsampled measurements
export async function up(db: Kysely<any>) {
  await sql`
  CREATE MATERIALIZED VIEW ruuvi_measurement_1m
  AS (
    SELECT
      time_bucket('1 minute', time) AS time,
      m.source,
      avg(temperature) AS temperature,
      avg(humidity) AS humidity,
      avg(pressure) AS pressure,
      COALESCE(cc.name, m.source::text) AS name
    FROM ruuvi_measurement AS m LEFT JOIN LATERAL (
      SELECT COALESCE(c.name, shortname) AS name, c.source
      FROM config AS c
      WHERE c.source = m.source AND c.time <= m.time
      ORDER BY c.time DESC LIMIT 1
    ) cc ON cc.source = m.source
    GROUP BY m.source, time, name
    ORDER BY time
  )
  WITH NO DATA;
`.execute(db)

  // Add materialized view for hourly downsampled measurements
  await sql`
    CREATE MATERIALIZED VIEW ruuvi_measurement_1h
    AS (
      SELECT
        time_bucket('1 hour', time) AS time,
        m.source,
        avg(temperature) AS temperature,
        avg(humidity) AS humidity,
        avg(pressure) AS pressure,
        m.name
      FROM ruuvi_measurement_1m AS m
      GROUP BY m.source, time, name
      ORDER BY time
    )
    WITH NO DATA;
  `.execute(db)

  // Refresh downsampled measurements
  await sql`
    REFRESH MATERIALIZED VIEW ruuvi_measurement_1m;
  `.execute(db)
  await sql`
    REFRESH MATERIALIZED VIEW ruuvi_measurement_1h;
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove materialized views
  await sql`
  DROP MATERIALIZED VIEW ruuvi_measurement_1h;
`.execute(db)

  await sql`
    DROP MATERIALIZED VIEW ruuvi_measurement_1m;
  `.execute(db)
}
