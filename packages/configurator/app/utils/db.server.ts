import { createClient } from '@ruuvipuserrin/common-archive-client'
import type { ValidTenantId } from '@ruuvipuserrin/common-data'

export type Item = {
  id: string
  listener_id?: string
  name?: string
  location?: string
}

export type FormInput = { editable: boolean; autofocus: boolean; name: keyof Item; description: string }

export const schema: FormInput[] = [
  { editable: false, autofocus: false, name: 'id', description: 'Source Device ID' },
  { editable: false, autofocus: false, name: 'listener_id', description: 'Listener ID' },
  { editable: true, autofocus: true, name: 'name', description: 'Source Device Name' },
  { editable: true, autofocus: false, name: 'location', description: 'Source Device Location' },
]

const client = createClient()

const mock: Map<ValidTenantId, Map<string, Item>> = new Map()

export default {
  read: async (tenantId: ValidTenantId) => {
    const result = await client.getSources.query({ tenantId })
    const stuff = mock.get(tenantId) ?? new Map()
    mock.set(tenantId, stuff)
    result.forEach((id) => stuff.set(id, { id, ...stuff.get(id) }))
    return Array.from(stuff.values())
  },
  write: (tenantId: ValidTenantId, input: Pick<Item, 'id' | 'name' | 'location'>) => {
    const stuff = mock.get(tenantId) ?? new Map()
    const originalItem = stuff.get(input.id)
    if (!originalItem) {
      throw new Error(`Item with id ${input.id} not found`)
    }
    const modifiedItem: Item = {
      ...originalItem,
      name: input.name ?? originalItem.name,
      location: input.location ?? originalItem.location,
    }
    stuff.set(input.id, modifiedItem)
    mock.set(tenantId, stuff)
  },
}
