import { z } from 'zod'
import minimist from 'minimist'

const ZQueuerArgsFromProcessArgv = z.object({
  measurementName: z.string(),
  pollingInterval: z.coerce.number().gt(999),
})

type QueuerArgs = z.infer<typeof ZQueuerArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): QueuerArgs {
  const argsInput = minimist(argv.slice(2), {
    alias: { m: 'measurementName', i: 'pollingInterval' },
    default: { measurementName: 'measurement', pollingInterval: 15000 },
  })
  return ZQueuerArgsFromProcessArgv.parse(argsInput)
}
