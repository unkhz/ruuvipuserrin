import { z } from 'zod'
import { createClient } from '@ruuvipuserrin/common-archive-client'
import { ZConfig } from '@ruuvipuserrin/common-data'
import type { ValidTenantId } from '@ruuvipuserrin/common-data'

function getDateAndTime(inputDatetime?: string) {
  const date = inputDatetime ? new Date(inputDatetime) : new Date()
  const yyyy = date.getFullYear()
  const mm = `${date.getMonth() + 1}`.padStart(2, '0')
  const dd = `${date.getDate()}`.padStart(2, '0')
  return {
    date: `${yyyy}-${mm}-${dd}`,
    time: date.toLocaleTimeString(),
  }
}

export const ZItem = z.object({
  source: z.string(),
  date: z.string(),
  time: z.string(),
  name: z.string(),
  shortname: z.string(),
  location: z.string(),
})
export type Item = z.infer<typeof ZItem>

export type FormInput = {
  editable: boolean
  autofocus: boolean
  type: 'text' | 'number' | 'date' | 'time'
  name: keyof Item
  description: string
  newValue?: () => string | number
  cellClassName?: string
}

export const schema: FormInput[] = [
  {
    editable: false,
    autofocus: false,
    type: 'text',
    name: 'source',
    description: 'Source Device ID',
  },
  {
    editable: true,
    autofocus: false,
    type: 'date',
    name: 'date',
    description: 'Effective Date',
    newValue: () => getDateAndTime().date,
    cellClassName: 'hidden md:table-cell',
  },
  {
    editable: true,
    autofocus: false,
    type: 'time',
    name: 'time',
    description: 'Effective Time',
    newValue: () => getDateAndTime().time,
    cellClassName: 'hidden md:table-cell',
  },
  { editable: true, autofocus: true, type: 'text', name: 'name', description: 'Source Device Name' },
  {
    editable: true,
    autofocus: true,
    type: 'text',
    name: 'shortname',
    description: 'Source Device Short Name',
    cellClassName: 'hidden sm:table-cell',
  },
  {
    editable: true,
    autofocus: false,
    type: 'text',
    name: 'location',
    description: 'Source Device Location',
    cellClassName: 'hidden sm:table-cell',
  },
]

const client = createClient()

const api = {
  read: async (tenantId: ValidTenantId) => {
    const configs = await client.getCurrentConfigs.query({ tenantId })
    return configs.map((config) => {
      const { time: datetime, ...items } = config
      const { date, time } = getDateAndTime(datetime?.toString())
      return { date, time, ...items }
    })
  },
  write: async (tenantId: ValidTenantId, input: Item) => {
    const { date, time, ...data } = input
    const datetime = new Date(`${date}T${time}`).getTime() / 1000
    return client.addConfig.mutate({ tenantId, config: ZConfig.parse({ ...data, time: datetime }) })
  },
}

export default api
