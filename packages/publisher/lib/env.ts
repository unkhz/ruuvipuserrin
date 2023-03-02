import { ZValidTenantId } from '@ruuvipuserrin/common-postgres'
import { z } from 'zod'

const ZEnv = z.object({
  TENANT_ID: ZValidTenantId,
})

type EnvSource = Record<string, string | undefined>

function envSource(): EnvSource {
  return global.process?.env ?? (global as unknown as EnvSource)
}

export function getEnv(env = envSource()) {
  return ZEnv.parse(env)
}
