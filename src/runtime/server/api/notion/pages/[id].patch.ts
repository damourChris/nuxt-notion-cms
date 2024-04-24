import { defineEventHandler, getRouterParams, readBody } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  if (!event.context.params) return { statusCode: 400, message: 'Bad Request' }

  const { id } = getRouterParams(event)

  try {
    const client = getNotionClient()
    const body = await readBody(event)
    if (body.archived) {
      return client.pages.update({ page_id: id, archived: true })
    }
    else {
      return client.pages.update({ page_id: id, properties: body.properties })
    }
  }
  catch (error) {
    if (isNotionClientError(error)) {
      return handleNotionError(error)
    }
    else {
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      }
    }
  }
})
