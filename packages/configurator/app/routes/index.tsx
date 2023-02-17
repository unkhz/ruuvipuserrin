import type { LinksFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData } from '@remix-run/react'
import db from '~/utils/db.server'

import tailwindCss from '~/styles/tailwind.css'
import indexCss from '~/styles/index.css'
import { Navbar, Table } from 'flowbite-react'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: indexCss },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Anton|Barlow' },
]

export const loader = async () => {
  return json({
    items: await db.read(),
  })
}

export default function ConfigRoute() {
  const data = useLoaderData<typeof loader>()
  return (
    <main>
      <Navbar className="w-full px-2 py-4 text-xl sm:text-5xl bg-zinc-200 dark:bg-zinc-800">
        Ruuvipuserrin Tag Configurator
      </Navbar>
      <div className="flex justify-center sm:px-8 sm:py-16">
        <div className="container flex-none mx-auto max-w-4xl">
          <Table>
            <Table.Head className="text-left">
              <Table.HeadCell>Tag ID</Table.HeadCell>
              <Table.HeadCell>Gateway ID</Table.HeadCell>
              <Table.HeadCell>Tag Name</Table.HeadCell>
              <Table.HeadCell>Tag Location</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {data.items.map(({ id, name, location }) => (
                <Table.Row key={id}>
                  <Table.Cell>{id}</Table.Cell>
                  <Table.Cell>unknown</Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{location}</Table.Cell>
                  <Table.Cell>
                    <a href="#">Edit</a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </main>
  )
}
