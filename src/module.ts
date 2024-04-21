import type { ClientOptions } from '@notionhq/client/build/src/Client.d.ts'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import defu from 'defu'

export interface ModuleOptions extends ClientOptions {
  db?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-notion-cms',
    configKey: 'notion',
  },

  // Default configuration options of the Nuxt module
  defaults: {
    auth: process.env.NOTION_API_KEY,
    db: process.env.NOTION_DATABASE_ID,

  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    // Private runtime config
    nuxt.options.runtimeConfig.notion = defu(nuxt.options.runtimeConfig.notion, options)

    addPlugin(resolve(runtimeDir, 'plugins', 'client'))
  },
})
