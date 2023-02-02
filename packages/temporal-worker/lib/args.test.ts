import { readArgs } from './args'

describe('readArgs', () => {
  it('should produce record of args', async () => {
    const argv = ['ts-node', 'index.ts', '--pollingInterval=27668', '--taskQueue=test']
    expect(readArgs(argv)).toEqual({ taskQueue: 'test' })
  })

  it('should produce record of args with shorthand options', async () => {
    const argv = ['ts-node', 'index.ts', '-i=27688', '-q=test']
    expect(readArgs(argv)).toEqual({ pollingInterval: 27668, taskQueue: 'test' })
  })
})
