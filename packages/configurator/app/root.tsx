import { Links, LiveReload, Outlet } from '@remix-run/react'

export default function App() {
  return (
    <html lang="en" className="">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ruuvipuserrin configurator</title>
        <Links />
      </head>
      <body className="h-screen">
        <Outlet />
        <LiveReload />
      </body>
    </html>
  )
}
