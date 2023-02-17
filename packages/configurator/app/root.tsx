import { Links, LiveReload, Outlet } from '@remix-run/react'

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ruuvipuserrin configurator</title>
        <Links />
      </head>
      <body className="bg-white text-black dark:bg-black dark:text-gray-200 h-screen">
        <Outlet />
        <LiveReload />
      </body>
    </html>
  )
}
