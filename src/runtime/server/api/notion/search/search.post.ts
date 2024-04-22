import { defineEventHandler, readBody } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const client = getNotionClient()
    const block = await client.search(body)

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
