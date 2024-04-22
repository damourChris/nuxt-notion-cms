import { defineEventHandler, getRouterParams } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  if (!event.context.params) return { statusCode: 400, message: 'Bad Request' }

  const { page_id, property_id } = getRouterParams(event)

  try {
    const client = getNotionClient()
    return client.pages.properties.retrieve({ page_id, property_id })
  }
  catch (error) {
    if (isNotionClientError(error)) {
      handleNotionError(error)
    }
    else {
      return {
        statusCode: 500,
        message: 'Internal Server Error',
      }
    }
  }
})
