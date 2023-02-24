import { z } from 'zod'
import minimist from 'minimist'

const ZPublisherArgsFromProcessArgv = z.object({
  measurementName: z.string(),
  pollingInterval: z.coerce.number().gt(999),
})

type PublisherArgs = z.infer<typeof ZPublisherArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): PublisherArgs {
  const argsInput = minimist(argv.slice(2), {
    alias: { m: 'measurementName', i: 'pollingInterval' },
    default: { measurementName: 'measurement', pollingInterval: 15000 },
  })
  return ZPublisherArgsFromProcessArgv.parse(argsInput)
}
