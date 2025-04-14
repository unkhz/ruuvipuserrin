import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './root.jsx'

vi.mock('@remix-run/react', () => {
  return {
    ...vi.importActual('@remix-run/react'),
    Links: () => <></>,
    Scripts: () => <></>,
    Outlet: () => <></>,
  }
})

test('renders', () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Ruuvipuserrin', level: 1 })).toBeVisible()
})
