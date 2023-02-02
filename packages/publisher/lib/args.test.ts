import { readArgs } from './args'

describe('readArgs', () => {
  it('should produce record of args', async () => {
    const argv = ['ts-node', 'index.ts', '--pollingInterval=109837', '--taskQueue=test']
    expect(readArgs(argv)).toEqual({ pollingInterval: 109837, taskQueue: 'test' })
  })

  it('should produce record of args with shorthand options', async () => {
    const argv = ['ts-node', 'index.ts', '-i=109837', '-q=test']
    expect(readArgs(argv)).toEqual({ pollingInterval: 109837, taskQueue: 'test' })
  })
})
