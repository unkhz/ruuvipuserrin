type Item = {
  id: string
  name: string
  location: string
}

const stuff: Item[] = [
  { id: 'a', name: 'stuff', location: 'drawer' },
  { id: 'b', name: 'exist', location: 'abstract' },
  { id: 'c', name: 'here', location: 'place' },
]

export default {
  read: () => stuff,
  write: (thing: Item) => stuff.push(thing),
}
