import { z } from 'zod'

// TODO: Placeholder decision for valid tenant ids
export const ZValidTenantId = z.enum(['dev', 'test', 'prod'])
export type ValidTenantId = z.infer<typeof ZValidTenantId>
