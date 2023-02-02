import { readArgs } from './args'

describe('readArgs', () => {
  it('should produce record of args', async () => {
    const argv = ['ts-node', 'index.ts', '--taskQueue=test']
    expect(readArgs(argv)).toEqual({ taskQueue: 'test' })
  })

  it('should produce record of args with shorthand options', async () => {
    const argv = ['ts-node', 'index.ts', '-q=test']
    expect(readArgs(argv)).toEqual({ taskQueue: 'test' })
  })
})
