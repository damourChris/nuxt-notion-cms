import { Client } from '@notionhq/client'
import type { Ref } from 'vue'
import { defineNuxtPlugin, useAsyncData, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin({
  name: 'nuxt-notion-cms',
  enforce: 'pre',
  setup() {
    const config = useRuntimeConfig().public.notion

    const notionFetch = $fetch.create({
      baseURL: config.apiBase,
    })

    const client = new Client({
      ...config,
      auth: 'custom-auth-token',
      fetch: async (url, params) => {
        const urlSlug = url.replace('https://api.notion.com/v1', '')

        const res = await useAsyncData(urlSlug, () => notionFetch(urlSlug), {
          server: true,
          getCachedData(key, nuxtApp) {
            const data: Ref<unknown> = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
            return data
          },
        })

        const data = res.data.value as unknown

        const response = new Response(JSON.stringify(data), params)

        return response
      },
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
