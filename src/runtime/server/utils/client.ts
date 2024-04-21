import { Client } from '@notionhq/client'
import { useRuntimeConfig } from '#imports'

let notionClient: Client

export const getNotionClient = (): Client => {
  if (notionClient) return notionClient

  const { notion: config } = useRuntimeConfig()

  notionClient = new Client(config)

  return notionClient
}
