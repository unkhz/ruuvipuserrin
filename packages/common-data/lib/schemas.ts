import { z } from 'zod'

// TODO: Placeholder decision for valid tenant ids
export const ZValidTenantId = z.enum(['dev', 'test', 'prod'])
export type ValidTenantId = z.infer<typeof ZValidTenantId>

export const ZMeasurement = z.object({
  source: z.string(),
  time: z.number(),
  temperature: z.number(),
  humidity: z.number(),
  pressure: z.number(),
})

export const ZConfig = z.object({
  source: z.string().min(1, { message: 'Source Device ID is required' }),
  time: z.coerce.number(),
  name: z.string().min(1, { message: 'Source Device Name is required' }),
  shortname: z.string().min(1, { message: 'Source Device Short Name is required' }),
  location: z.string().min(1, { message: 'Source Device Location is required' }),
})
