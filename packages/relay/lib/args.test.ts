import { describe, expect, it } from 'bun:test'
import { readArgs } from './args'

describe('readArgs', () => {
  it('should produce record of args', async () => {
    const argv = ['bun', 'index.ts', '--measurementName=test']
    expect(readArgs(argv)).toEqual({ measurementName: 'test' })
  })

  it('should produce record of args with shorthand options', async () => {
    const argv = ['bun', 'index.ts', '-m=test']
    expect(readArgs(argv)).toEqual({ measurementName: 'test' })
  })
})
