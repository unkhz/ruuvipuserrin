import { z } from 'zod'

const ZEnv = z.object({
  INFLUX_URL: z.string(),
  INFLUX_TOKEN: z.string(),
  INFLUX_ORG: z.string(),
  INFLUX_BUCKET: z.string(),
})

export function getEnv(env = process.env) {
  return ZEnv.parse(env)
}
