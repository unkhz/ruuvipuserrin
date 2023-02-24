import { z } from 'zod'

const ZEnv = z.object({
  ARCHIVE_API_SSL: z.preprocess((value) => {
    const falsyValues = ['0', 'false', 'off', '']
    if (typeof value === 'string') {
      return !falsyValues.includes(value.toLowerCase())
    }
    return Boolean(value)
  }, z.boolean()),
  ARCHIVE_API_HOST: z.string(),
  ARCHIVE_API_PORT: z.coerce.number().optional(),
  ARCHIVE_API_PATH: z.string(),
})

type EnvSource = Record<string, string | undefined>

function envSource(): EnvSource {
  return global.process?.env ?? (global as unknown as EnvSource)
}

export function getEnv(env = envSource()) {
  return ZEnv.parse(env)
}
