import { z } from 'zod'
import minimist from 'minimist'

const ZPublisherArgsFromProcessArgv = z.object({
  pollingInterval: z.coerce.number().gt(1000),
  taskQueue: z.string(),
})

type PublisherArgs = z.infer<typeof ZPublisherArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): PublisherArgs {
  const argsInput = minimist(argv.slice(2), {
    alias: { i: 'pollingInterval', q: 'taskQueue' },
    default: { pollingInterval: 'measurement' },
  })
  return ZPublisherArgsFromProcessArgv.parse(argsInput)
}
