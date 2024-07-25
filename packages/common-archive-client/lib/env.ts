import { z } from 'zod'
import { base64 } from 'rfc4648'

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
  ARCHIVE_API_PATH: z.preprocess((value) => (value ? value : undefined), z.string().default('/trpc')),
  ARCHIVE_API_CLIENT_ID: z.string().optional(),
  ARCHIVE_API_CLIENT_SECRET: z.string().optional(),
})

type EnvSource = Record<string, string | undefined>

function envSource(): EnvSource {
  return global.process?.env ?? (global as unknown as EnvSource)
}

export function getEnv(env = envSource()) {
  const result = ZEnv.safeParse(env)
  if (!result.success) {
    console.error(result.error)
    throw new Error(`Invalid environment variables: ${result.error.message}`)
  }
  return result.data
}
