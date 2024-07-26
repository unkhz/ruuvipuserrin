import type { ActionFunctionArgs, LinksFunction } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Form, useLoaderData, useSearchParams } from '@remix-run/react'
import type { Item } from '~/utils/db.server'
import db, { schema, ZItem } from '~/utils/db.server'

import webappManifest from '~/app.webmanifest'
import { ZValidTenantId } from '@ruuvipuserrin/common-data'

import '~/styles/tailwind.css'
import '~/styles/index.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Advent+Pro|Barlow' },
  { rel: 'manifest', href: webappManifest },
]

function getValidTenantId(params: ActionFunctionArgs['params']) {
  return ZValidTenantId.parse(params.tenantId)
}

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.formData()
  const data = Object.fromEntries(schema.map(({ name }) => [name, form.get(name)]))
  const tenantId = getValidTenantId(params)
  try {
    await db.write(tenantId, ZItem.parse(data))
  } catch (err) {
    console.error('write error', err)
  }

  return redirect(`/tenant/${tenantId}`)
}

export const loader = async ({ params }: ActionFunctionArgs) => {
  try {
    getValidTenantId(params)
  } catch (err) {
    return redirect('/tenant/dev', { status: 302 })
  }

  try {
    const items = await db.read(getValidTenantId(params))
    return json({
      items,
      error: null,
    })
  } catch (err) {
    console.error('read error', err)
    return json({
      items: [],
      error: err,
    })
  }
}

function SourceEditModal({ item }: { item: Partial<Item> }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <Form className="form-control" method="post">
          <h3 className="text-lg mx-2">Edit source: {item.source}</h3>
          {schema.map(({ name, type, autofocus, editable, description, newValue }) => {
            const htmlId = `edit-item-${item.source}-${name}`
            return (
              <div key={name} className="mx-1 my-2 form-control">
                <span className="label-text w-48 min-w-max sm:hidden">{description}</span>

                <label className="input-group" htmlFor={htmlId}>
                  <span className="label-text hidden sm:flex">{description}</span>
                  <input
                    className="input input-bordered w-48 min-w-max"
                    name={name}
                    id={htmlId}
                    type={type}
                    autoFocus={autofocus}
                    defaultValue={newValue ? newValue() : item[name]}
                    readOnly={!editable}
                  />
                </label>
              </div>
            )
          })}
          <div className="modal-action">
            <a className="btn" href="?index">
              Cancel
            </a>
            <input type="submit" className="btn" value="Submit" />
          </div>
        </Form>
      </div>
    </div>
  )
}

export default function SourcesTable() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const items = data.items.filter((item) => typeof item === 'object' && item !== null)
  const editItemId = searchParams.get('edit')
  const editItem = editItemId ? items.find((item) => item.source === editItemId) : null
  return (
    <>
      <table className="table w-full">
        <thead>
          {schema.map(({ name, cellClassName }) => (
            <th key={name} className={cellClassName}>
              {name}
            </th>
          ))}
          <th></th>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.source}>
              {schema.map(({ name, cellClassName }) => (
                <td key={name} className={cellClassName}>
                  {item[name] ?? '<none>'}
                </td>
              ))}
              <td>
                <a className="btn btn-xs" href={`?edit=${item.source}`}>
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
