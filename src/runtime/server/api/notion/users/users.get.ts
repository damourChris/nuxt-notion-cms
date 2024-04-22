import { defineEventHandler, setResponseStatus } from 'h3'
import { isNotionClientError } from '@notionhq/client'
import { getNotionClient, handleNotionError } from '#server/utils'

export default defineEventHandler(async (event) => {
  try {
    const client = getNotionClient()

    const reponse = await client.users.list({})

    return reponse
  }
  catch (error) {
    setResponseStatus(event, 500, 'Internal Server Error')
    if (isNotionClientError(error)) {
      return handleNotionError(error)
    }
    else {
      return {
        message: 'Internal Server Error',
      }
    }
  }
})
