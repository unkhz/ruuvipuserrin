import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'

export const loader: LoaderFunction = async ({ request }) => {
  return redirect('/tenant/dev', { status: 302 })
}
