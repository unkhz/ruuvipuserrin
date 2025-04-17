import * as VitestConfig from 'vitest/config'

export default VitestConfig.defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    includeSource: ['lib/**/*.{ts,tsx}'],
    exclude: ['node_modules', 'e2e'],
  },
  plugins: [],
})
