import { z } from 'zod'
import minimist from 'minimist'

const ZWorkerArgsFromProcessArgv = z.object({
  pollingInterval: z.coerce.number().gt(1000),
  taskQueue: z.string(),
})

type WorkerArgs = z.infer<typeof ZWorkerArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): WorkerArgs {
  const argsInput = minimist(argv.slice(2), {
    alias: { i: 'pollingInterval', q: 'taskQueue' },
    default: { taskQueue: 'measurement' },
  })
  return ZWorkerArgsFromProcessArgv.parse(argsInput)
}
