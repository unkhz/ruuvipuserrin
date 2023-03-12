import { Kysely, sql } from 'kysely'
import * as materializedViewsMigration from './006-downsample-measurement'

export async function up(db: Kysely<any>) {
  // Drop materialized views
  await materializedViewsMigration.down(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // Recreate materialized views
  await materializedViewsMigration.up(db)
}
