import { z } from 'zod'

const ZEnv = z.object({
  PG_HOST: z.string(),
  PG_PORT: z.string(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DB: z.string(),
  /** Base64 encoded certificate **/
  PG_CERT: z.preprocess(
    (base64EncodedString: unknown): string => Buffer.from(`${base64EncodedString}`, 'base64').toString(),
    z.string().startsWith('-----BEGIN CERTIFICATE-----').endsWith('-----END CERTIFICATE-----'),
  ),
})

export function getEnv(env = process.env) {
  return ZEnv.parse(env)
}
