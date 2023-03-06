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
  defaultValue?: string | number
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
    defaultValue: Date.now(),
  },
  { editable: true, autofocus: true, type: 'text', name: 'name', description: 'Source Device Name' },
  { editable: true, autofocus: true, type: 'text', name: 'shortname', description: 'Source Device Short Name' },
  { editable: true, autofocus: false, type: 'text', name: 'location', description: 'Source Device Location' },
]

const client = createClient()

const mock: Map<ValidTenantId, Map<string, Item>> = new Map()

export default {
  read: async (tenantId: ValidTenantId) => {
    const result = await client.getSources.query({ tenantId })
    const stuff = mock.get(tenantId) ?? new Map()
    mock.set(tenantId, stuff)
    result.forEach((source) => stuff.set(source, { source, ...stuff.get(source) }))
    return Array.from(stuff.values())
  },
  write: (tenantId: ValidTenantId, input: Item) => {
    const stuff = mock.get(tenantId) ?? new Map()
    const originalItem = stuff.get(input.source)
    if (!originalItem) {
      throw new Error(`Item with id ${input.source} not found`)
    }
    const modifiedItem: Item = {
      ...originalItem,
      ...ZConfig.parse(input),
    }
    stuff.set(input.source, modifiedItem)
    mock.set(tenantId, stuff)
  },
}
