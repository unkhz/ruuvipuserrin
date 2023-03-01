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
  ARCHIVE_CLIENT_GCLOUD_SCOPE: z.string().optional(),
  /* Base64 encoded JSON */
  ARCHIVE_CLIENT_GCLOUD_CREDENTIALS: z.preprocess(
    (base64EncodedString: unknown) =>
      base64EncodedString
        ? JSON.parse(new TextDecoder().decode(base64.parse(base64EncodedString as string)))
        : undefined,
    z
      .object({
        type: z.string(),
        project_id: z.string(),
        private_key_id: z.string(),
        private_key: z.string(),
        client_email: z.string(),
        client_id: z.string(),
        auth_uri: z.string(),
        token_uri: z.string(),
        auth_provider_x509_cert_url: z.string(),
        client_x509_cert_url: z.string(),
      })
      .optional(),
  ),
})

type EnvSource = Record<string, string | undefined>

function envSource(): EnvSource {
  return global.process?.env ?? (global as unknown as EnvSource)
}

export function getEnv(env = envSource()) {
  return ZEnv.parse(env)
}
