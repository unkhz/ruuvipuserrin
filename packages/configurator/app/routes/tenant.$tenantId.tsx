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
import { ZConfig, ZValidTenantId } from '@ruuvipuserrin/common-data'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: indexCss },
  { rel: 'stylesheet', href: tailwindCss },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Advent+Pro|Barlow' },
  { rel: 'manifest', href: webappManifest },
]

function getValidTenantId(params: ActionArgs['params']) {
  return ZValidTenantId.parse(params.tenantId)
}

export const action = async ({ request, params }: ActionArgs) => {
  const form = await request.formData()
  const data = Object.fromEntries(schema.map(({ name }) => [name, form.get(name)]))
  const tenantId = getValidTenantId(params)
  await db.write(tenantId, ZConfig.parse(data))
  return redirect(`/tenant/${tenantId}`)
}

export const loader = async ({ params }: ActionArgs) => {
  try {
    getValidTenantId(params)
  } catch (err) {
    return redirect('/tenant/dev', { status: 302 })
  }

  return json({
    items: await db.read(getValidTenantId(params)),
  })
}

function SourceEditModal({ item }: { item: Item }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <Form className="form-control" method="post">
          <h3 className="text-lg mx-2">Edit source: {item.source}</h3>
          {schema.map(({ name, type, autofocus, editable, description, defaultValue }) => {
            const htmlId = `edit-item-${item.source}-${name}`
            return (
              <fieldset key={name} className="mx-1">
                <label className="label" htmlFor={htmlId}>
                  <span className="label-text">{description}</span>
                </label>
                <input
                  className="input input-bordered"
                  name={name}
                  id={htmlId}
                  type={type}
                  autoFocus={autofocus}
                  defaultValue={item[name] ?? defaultValue}
                  readOnly={!editable}
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

export default function SourcesTable() {
  const data = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const editItemId = searchParams.get('edit')
  const editItem = data.items.find((item) => item.source === editItemId)
  return (
    <>
      <table className="table w-full">
        <thead>
          {schema.map(({ name }) => (
            <th key={name}>{name}</th>
          ))}
          <th></th>
        </thead>
        <tbody>
          {data.items.map((item: Item) => (
            <tr key={item.source}>
              {schema.map(({ name }) => (
                <td key={name}>{item[name] ?? '<none>'}</td>
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
