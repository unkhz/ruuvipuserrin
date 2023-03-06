import { getAuth } from '@clerk/remix/ssr.server'
import type { LoaderFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'

export const loader: LoaderFunction = async (args) => {
  const { userId, sessionId } = await getAuth(args)
  if (!userId) {
    return redirect('https://huge-sawfish-58.accounts.dev/sign-in')
  }
  // Your loader here
}

export default function IndexRoute() {
  return (
    <main>
      <a href="/tenant/dev" className="btn">
        Development
      </a>
      <a href="/tenant/prod" className="btn">
        Production
      </a>
    </main>
  )
}
