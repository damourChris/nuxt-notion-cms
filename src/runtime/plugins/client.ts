import { Client } from '@notionhq/client'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin({
  name: 'nuxt-notion-cms',
  enforce: 'pre',
  async setup() {
    const config = useRuntimeConfig().public.notion

    const client = new Client({
      ...config,
      auth: 'custom-auth-token',
    })

    return {
      provide: {
        notion: {
          client,
        },
      },
    }
  },
})
