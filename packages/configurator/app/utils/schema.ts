import { z } from 'zod'
import { getDateAndTime } from './date.js'

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
