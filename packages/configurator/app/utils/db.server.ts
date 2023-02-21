export type Item = {
  id: string
  listener_id: string
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

const stuff: Map<string, Item> = new Map([
  ['a', { id: 'a', listener_id: 'irue983', name: 'stuff', location: 'drawer' }],
  ['b', { id: 'b', listener_id: 'irue983', name: 'exist', location: 'abstract' }],
  ['c', { id: 'c', listener_id: 'e83kjsd', name: 'here', location: 'place' }],
])

export default {
  read: () => Array.from(stuff.values()),
  write: (id: string, input: Pick<Item, 'name' | 'location'>) => {
    const originalItem = stuff.get(id)
    if (!originalItem) {
      throw new Error(`Item with id ${id} not found`)
    }
    const modifiedItem: Item = {
      ...originalItem,
      name: input.name ?? originalItem.name,
      location: input.location ?? originalItem.location,
    }
    stuff.set(id, modifiedItem)
  },
}
