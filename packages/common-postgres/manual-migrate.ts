import { z } from 'zod'
import minimist from 'minimist'
import { migrateOneDown, migrateOneUp, migrateToLatest } from './lib/migrate'
import { createClient } from './lib/client'
import { ZValidTenantId } from '@ruuvipuserrin/common-data'

const ZRunMigrateArgsFromProcessArgv = z.object({
  tenantId: ZValidTenantId,
  job: z.enum(['down', 'up', 'latest']),
})

type RunMigrateArgs = z.infer<typeof ZRunMigrateArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): RunMigrateArgs {
  const argsInput = minimist(argv.slice(2))
  return ZRunMigrateArgsFromProcessArgv.parse(argsInput)
}

const args = readArgs()
const db = createClient(args.tenantId)

async function runJob() {
  switch (args.job) {
    case 'down':
      return migrateOneDown(db)
    case 'up':
      return migrateOneUp(db)
    case 'latest':
      return migrateToLatest(db)
    default:
      throw new Error(`Invalid job ${args.job}`)
  }
}

runJob().catch((error) => {
  console.error(error)
  process.exit(1)
})
