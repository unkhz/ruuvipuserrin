import { defineConfig } from 'vite'
import { vitePlugin as remix } from '@remix-run/dev'
import tailwindcss from '@tailwindcss/vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import path from 'path'

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
    },
  },
  plugins: [
    remix({
      ignoredRouteFiles: ['**/*.css', '**/*.test.tsx', '**/*.test.ts'],
    }),
    tailwindcss(),
    devtoolsJson(),
  ],
})
