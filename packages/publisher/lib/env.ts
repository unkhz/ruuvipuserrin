import { ZValidTenantId } from '@ruuvipuserrin/common-data'
import { z } from 'zod'

const ZEnv = z.object({
  TENANT_ID: ZValidTenantId,
  REDIS_HOST: z.string(),
  REDIS_PORT: z.coerce.number(),
})

type EnvSource = Record<string, string | undefined>

function envSource(): EnvSource {
  return global.process?.env ?? (global as unknown as EnvSource)
}

export function getEnv(env = envSource()) {
  return ZEnv.parse(env)
}
