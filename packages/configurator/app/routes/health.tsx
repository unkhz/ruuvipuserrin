import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params }: LoaderFunctionArgs) {
  return new Response('OK', {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/plain',
      'X-Health-Check': 'OK',
    },
  })
}
