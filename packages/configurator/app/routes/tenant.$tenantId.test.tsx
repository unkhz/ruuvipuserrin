import { expect, test, vi } from 'vitest'
import { json } from '@remix-run/node'
import { createRemixStub } from '@remix-run/testing'
import { render, screen, waitFor } from '@testing-library/react'
import { generateMock } from '@anatine/zod-mock'
import SourcesTable from './tenant.$tenantId.jsx'
import { ZItem } from '~/utils/schema.js'

vi.mock('@ruuvipuserrin/common-archive-client', () => {
  return {
    createClient: vi.fn(),
  }
})

test('renders', async () => {
  const items = [generateMock(ZItem), generateMock(ZItem), generateMock(ZItem)]
  const WrappedSourcesTable = createRemixStub([
    {
      path: '/',
      Component: SourcesTable,
      loader() {
        return json({ items, error: null })
      },
    },
  ])
  render(<WrappedSourcesTable />)

  await waitFor(() => screen.getAllByRole('link', { name: 'Edit' }).length === items.length)

  for (const item of items) {
    expect(screen.getByText(item.source)).toBeVisible()
    expect(screen.getByText(item.name)).toBeVisible()
    expect(screen.getByText(item.location)).toBeVisible()
  }
})
