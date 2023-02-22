import type { ActionArgs, LinksFunction } from '@remix-run/cloudflare'
import { redirect } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import type { Item } from '~/utils/db.server'
import { schema } from '~/utils/db.server'
import db from '~/utils/db.server'

import tailwindCss from '~/styles/tailwind.css'
import indexCss from '~/styles/index.css'
import webappManifest from '~/app.webmanifest'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexCss },
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Advent+Pro|Barlow' },
  { rel: 'manifest', href: webappManifest },
]

export const action = async ({ request }: ActionArgs) => {
  const form = await request.formData()
  const id = form.get('id')
  const name = form.get('name')
  const location = form.get('location')
  console.log('dat', { id, name, location })
  if (typeof id !== 'string' || typeof name !== 'string' || typeof location !== 'string') {
    throw new Error('Invalid form data')
  }
  await db.write(id, { name, location })
  return redirect('/')
}

export const loader = async () => {
  return json({
    items: await db.read(),
  })
}

function SourceEditModal({ item }: { item: Item }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <Form className="form-control" method="post">
          <h3 className="text-lg mx-2">Edit source: {item.id}</h3>
          {schema.map(({ name, autofocus, editable, description }) => {
            const htmlId = `edit-item-${item.id}-${name}`
            return (
              <fieldset key={name} className="mx-1">
                <label className="label" htmlFor={htmlId}>
                  <span className="label-text">{description}</span>
                </label>
                <input
                  className="input input-bordered"
                  name={name}
                  id={htmlId}
                  type="text"
                  autoFocus={autofocus}
                  defaultValue={item[name]}
                  hidden={!editable}
                />
              </fieldset>
            )
          })}
          <div className="modal-action">
            <a className="btn" href="/">
              Cancel
            </a>
            <input type="submit" className="btn" value="Submit" />
          </div>
        </Form>
      </div>
    </div>
  )
}

function SourcesTable() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const editItemId = searchParams.get('edit')
  const editItem = data.items.find((item) => item.id === editItemId)
  return (
    <>
      <table className="table w-full">
        <thead>
          <th>ID</th>
          <th>Listener ID</th>
          <th>Name</th>
          <th>Location</th>
          <th></th>
        </thead>
        <tbody>
          {data.items.map(({ id, listener_id = '<none>', name = '<none>', location = '<none>' }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{listener_id}</td>
              <td>{name}</td>
              <td>{location}</td>
              <td>
                <a className="btn btn-xs" href={`?edit=${id}`}>
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editItem ? <SourceEditModal item={editItem} /> : null}
    </>
  )
}

export default function ConfigRoute() {
  return (
    <main>
      <nav className="navbar w-full bg-zinc-100 dark:bg-zinc-900 px-2 py-4 text-4xl sm:text-5xl">Ruuvipuserrin</nav>
      <div className="flex justify-center sm:px-8 sm:py-16">
        <div className="container flex-none mx-auto max-w-4xl">
          <SourcesTable />
        </div>
      </div>
    </main>
  )
}
