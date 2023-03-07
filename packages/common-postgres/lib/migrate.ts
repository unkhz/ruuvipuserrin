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
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(error)
    throw new Error('failed to migrate', { cause: error })
  }
}

export async function migrateOneDown(db: ReturnType<typeof createClient>) {
  const migrator = createMigrator(db)
  const { error, results } = await migrator.migrateDown()
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(error)
    throw new Error('failed to migrate', { cause: error })
  }
}

export async function migrateOneUp(db: ReturnType<typeof createClient>) {
  const migrator = createMigrator(db)
  const { error, results } = await migrator.migrateUp()
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error(error)
    throw new Error('failed to migrate', { cause: error })
  }
}
