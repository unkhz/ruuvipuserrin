import { z } from 'zod'

const ZEnv = z.object({
  PG_HOST: z.string(),
  PG_PORT: z.coerce.number(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DB: z.string(),
  /* Base64 encoded certificate decoded to string */
  PG_CERT: z.preprocess(
    (base64EncodedString: unknown) =>
      base64EncodedString ? Buffer.from(`${base64EncodedString}`, 'base64').toString() : undefined,
    z.string().startsWith('-----BEGIN CERTIFICATE-----').endsWith('-----END CERTIFICATE-----').optional(),
  ),
})

type EnvSource = Record<string, string | undefined>

function envSource(): EnvSource {
  return global.process?.env ?? (global as unknown as EnvSource)
}

export function getEnv(env = envSource()) {
  return ZEnv.parse(env)
}
