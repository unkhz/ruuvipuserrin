import { z } from 'zod'
import minimist from 'minimist'

const ZQueuerArgsFromProcessArgv = z.object({
  measurementName: z.string(),
  pollingInterval: z.coerce.number().gt(1000),
  port: z.coerce.number(),
})

type QueuerArgs = z.infer<typeof ZQueuerArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): QueuerArgs {
  const argsInput = minimist(argv.slice(2), {
    alias: { m: 'measurementName', i: 'pollingInterval', p: 'port' },
    default: { measurementName: 'measurement', pollingInterval: 15000, port: 4000 },
  })
  return ZQueuerArgsFromProcessArgv.parse(argsInput)
}
