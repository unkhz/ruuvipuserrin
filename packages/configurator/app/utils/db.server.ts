type Item = {
  id: string
  listener_id: string
  name?: string
  location?: string
}

const stuff: Item[] = [
  { id: 'a', listener_id: 'irue983', name: 'stuff', location: 'drawer' },
  { id: 'b', listener_id: 'irue983', name: 'exist', location: 'abstract' },
  { id: 'c', listener_id: 'e83kjsd', name: 'here', location: 'place' },
]

export default {
  read: () => stuff,
  write: (thing: Item) => stuff.push(thing),
}
