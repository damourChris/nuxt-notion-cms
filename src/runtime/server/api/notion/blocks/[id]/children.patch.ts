import { defineEventHandler, getRouterParams, readBody } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  if (!event.context.params) return { statusCode: 400, message: 'Bad Request' }

  const { id } = getRouterParams(event)
  const body = await readBody(event)

  try {
    const client = getNotionClient()
    const block = await client.blocks.update({
      block_id: id,
      ...body,
    })

    return block
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
