import { Links, Outlet, Scripts } from '@remix-run/react'
import type { LinksFunction } from '@remix-run/cloudflare'
import tailwindCss from '~/styles/tailwind.css'
import indexCss from '~/styles/index.css'
import webappManifest from '~/app.webmanifest'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexCss },
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Advent+Pro|Barlow' },
  { rel: 'manifest', href: webappManifest },
]

export default function App() {
  return (
    <html lang="en" className="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ruuvipuserrin configurator</title>
        <Links />
      </head>
      <body className="min-h-screen">
        <main>
          <nav className="navbar w-full bg-zinc-100 dark:bg-zinc-900 px-2 py-4 text-4xl sm:text-5xl">Ruuvipuserrin</nav>
          <div className="flex justify-center sm:px-8 sm:py-16">
            <div className="container flex-none mx-auto max-w-4xl">
              <Outlet />
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}

export function ErrorBoundary({ error }: { error: unknown }) {
  console.error(error)
  const printableError = error instanceof Error ? error.stack : `${error}`
  return (
    <html lang="en" className="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Ruuvipuserrin configurator</title>
        <Links />
      </head>
      <body className="h-screen">
        <main>
          <nav className="navbar w-full bg-zinc-100 dark:bg-zinc-900 px-2 py-4 text-4xl sm:text-5xl">Ruuvipuserrin</nav>
          <div className="flex justify-center sm:px-8 sm:py-16">
            <div className="mockup-code bg-primary text-primary-content">
              <pre>{printableError}</pre>
            </div>
          </div>
        </main>
        <Scripts />
      </body>
    </html>
  )
}
