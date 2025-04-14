import { Kysely } from 'kysely'
import * as materializedViewsMigration from './006-downsample-measurement.js'
import * as materializedViewsFunctionMigration from './007-refresh-materialized-views.js'

export async function up(db: Kysely<any>) {
  // Drop materialized views
  await materializedViewsMigration.down(db)
  await materializedViewsFunctionMigration.down(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  // Recreate materialized views
  await materializedViewsMigration.up(db)
  await materializedViewsFunctionMigration.up(db)
}
