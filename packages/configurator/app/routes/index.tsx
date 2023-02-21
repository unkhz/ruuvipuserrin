import type { LinksFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { useLoaderData, useSearchParams } from '@remix-run/react'
import db from '~/utils/db.server'

import tailwindCss from '~/styles/tailwind.css'
import indexCss from '~/styles/index.css'
import { Modal, Navbar, Table } from 'flowbite-react'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: indexCss },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Anton|Barlow' },
  { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.3/flowbite.min.css' },
]

export const loader = async () => {
  return json({
    items: await db.read(),
  })
}

function EditModal() {
  return (
    <Modal show={false}>
      <Modal.Header>Terms of Service</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
            companies around the world are updating their terms of service agreements to comply.
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
            to ensure a common set of data rights in the European Union. It requires organizations to notify users as
            soon as possible of high-risk data breaches that could personally affect them.
          </p>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default function ConfigRoute() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const editItemId = searchParams.get('edit')
  return (
    <main>
      <Navbar className="w-full px-2 py-4 text-xl sm:text-5xl">Ruuvipuserrin Tag Configurator</Navbar>
      <div className="flex justify-center sm:px-8 sm:py-16">
        <div className="container flex-none mx-auto max-w-4xl">
          <Table>
            <Table.Head className="text-lef">
              <Table.HeadCell>ID</Table.HeadCell>
              <Table.HeadCell>Listener ID</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Location</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {data.items.map(({ id, listener_id = '<none>', name = '<none>', location = '<none>' }) => (
                <Table.Row key={id}>
                  <Table.Cell>{id}</Table.Cell>
                  <Table.Cell>{listener_id}</Table.Cell>
                  <Table.Cell>{name}</Table.Cell>
                  <Table.Cell>{location}</Table.Cell>
                  <Table.Cell>
                    <a href={`?edit=${id}`}>Edit</a>
                  </Table.Cell>
                </Table.Row>
              ))}
              {editItemId ? <EditModal /> : null}
            </Table.Body>
          </Table>
        </div>
      </div>
    </main>
  )
}
