import { createClient } from '@ruuvipuserrin/common-archive-client'
import { ZConfig } from '@ruuvipuserrin/common-data'
import type { ValidTenantId } from '@ruuvipuserrin/common-data'
import { getDateAndTime } from './date.js'
import type { Item } from './schema.js'

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
