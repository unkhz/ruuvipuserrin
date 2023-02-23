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
  ARCHIVE_API_PORT: z.coerce.number(),
  ARCHIVE_API_PATH: z.string(),
})

export function getEnv(env = process.env) {
  return ZEnv.parse(env)
}
