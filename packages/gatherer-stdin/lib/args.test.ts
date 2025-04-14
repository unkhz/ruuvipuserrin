import { afterEach, describe, expect, it, vi } from 'vitest'
import { readArgs } from './args.js'

describe('readArgs', () => {
  it('should produce record of args', async () => {
    const argv = ['bun', 'index.ts', '--measurementName=test', '--pollingInterval=10000']
    expect(readArgs(argv)).toEqual({ measurementName: 'test', pollingInterval: 10000 })
  })

  it('should produce record of args with shorthand options', async () => {
    const argv = ['bun', 'index.ts', '-m=test', '-i=10000']
    expect(readArgs(argv)).toEqual({ measurementName: 'test', pollingInterval: 10000 })
  })
})
