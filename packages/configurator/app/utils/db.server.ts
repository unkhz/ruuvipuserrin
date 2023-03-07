import { createClient } from '@ruuvipuserrin/common-archive-client'
import { ZConfig } from '@ruuvipuserrin/common-data'
import type { ValidTenantId } from '@ruuvipuserrin/common-data'
import type { z } from 'zod'

export type Item = z.infer<typeof ZConfig>

export type FormInput = {
  editable: boolean
  autofocus: boolean
  type: 'text' | 'number'
  name: keyof Item
  description: string
  newValue?: () => string | number
}

export const schema: FormInput[] = [
  {
    editable: false,
    autofocus: false,
    type: 'text',
    name: 'source',
    description: 'Source Device ID',
  },
  {
    editable: true,
    autofocus: false,
    type: 'number',
    name: 'time',
    description: 'Effective Datetime',
    newValue: () => Date.now() / 1000,
  },
  { editable: true, autofocus: true, type: 'text', name: 'name', description: 'Source Device Name' },
  { editable: true, autofocus: true, type: 'text', name: 'shortname', description: 'Source Device Short Name' },
  { editable: true, autofocus: false, type: 'text', name: 'location', description: 'Source Device Location' },
]

const client = createClient()

const api = {
  read: async (tenantId: ValidTenantId) => {
    const items = await client.getCurrentConfigs.query({ tenantId })
    // FIXME
    return items as unknown as Partial<Item>[]
  },
  write: async (tenantId: ValidTenantId, input: Item) => {
    return client.addConfig.mutate({ tenantId, config: ZConfig.parse(input) })
  },
}

export default api
