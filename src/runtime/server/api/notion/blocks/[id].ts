import { defineEventHandler, getRouterParams, readBody } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  if (!event.context.params) return { statusCode: 400, message: 'Bad Request' }

  const { id } = getRouterParams(event)

  const method = event.method

  try {
    const client = getNotionClient()
    switch (method) {
      case 'GET':
        return client.blocks.retrieve({ block_id: id })
      case 'PATCH':{
        const body = await readBody(event)
        return client.blocks.update({ block_id: id, ...body })
      }
      case 'DELETE': {
        return client.blocks.delete({ block_id: id })
      }
      default:
        return { statusCode: 405, message: 'Method Not Allowed' }
    }
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
