import { defineEventHandler, getRouterParams } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  if (!event.context.params) return { statusCode: 400, message: 'Bad Request' }

  const { id } = getRouterParams(event)

  try {
    const client = getNotionClient()
    const response = await client.databases.retrieve({ database_id: id })

    return response
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
