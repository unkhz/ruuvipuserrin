import { z } from 'zod'
import minimist from 'minimist'

const ZRelayArgsFromProcessArgv = z.object({
  measurementName: z.string(),
})

type RelayArgs = z.infer<typeof ZRelayArgsFromProcessArgv>

export function readArgs(argv: string[] = process.argv): RelayArgs {
  const argsInput = minimist(argv.slice(2), {
    alias: { m: 'measurementName' },
    default: { measurementName: 'measurement' },
  })
  return ZRelayArgsFromProcessArgv.parse(argsInput)
}
