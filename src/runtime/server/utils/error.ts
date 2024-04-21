import type { NotionClientError } from '@notionhq/client'

export const handleNotionError = (error: NotionClientError) => {
  return {
    statusCode: 500,
    message: error.message,
  }
}
