import * as path from 'path'
import { promises as fs } from 'fs'
import { Migrator, FileMigrationProvider } from 'kysely'
import { createClient } from './client'

function createMigrator(db: ReturnType<typeof createClient>) {
  return new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, '..', 'migrations'),
    }),
  })
}

export async function migrateToLatest(db: ReturnType<typeof createClient>) {
  const migrator = createMigrator(db)
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migrated up to "${it.migrationName}"`)
    } else if (it.status === 'Error') {
      console.error(`Failed to migrate up to "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to migrate', { cause: error })
  }
}

export async function migrateOneDown(db: ReturnType<typeof createClient>) {
  const migrator = createMigrator(db)
  const { error, results } = await migrator.migrateDown()
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migrated down from "${it.migrationName}"`)
    } else if (it.status === 'Error') {
      console.error(`Failed to migrate down from "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to migrate', { cause: error })
  }
}

export async function migrateOneUp(db: ReturnType<typeof createClient>) {
  const migrator = createMigrator(db)
  const { error, results } = await migrator.migrateUp()
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migrated up to "${it.migrationName}"`)
    } else if (it.status === 'Error') {
      console.error(`Failed to migrate up to "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(error)
    throw new Error('Failed to migrate', { cause: error })
  }
}
