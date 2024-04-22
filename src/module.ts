import type { ClientOptions } from '@notionhq/client/build/src/Client.d.ts'
import { defineNuxtModule, addPlugin, createResolver, addTemplate, addServerHandler } from '@nuxt/kit'
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

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}

      // Inline module runtime in Nitro bundle
      nitroConfig.externals = defu(typeof nitroConfig.externals === 'object' ? nitroConfig.externals : {}, {
        inline: [resolve('./runtime')],
      })
      nitroConfig.alias['#server/utils'] = resolve(runtimeDir, 'server', 'utils')
    })

    addTemplate({
      filename: 'types/server-utils.d.ts',
      getContents: () =>
        [
          'declare module \'#server/utils\' {',
          `  const getNotionClient: typeof import('${resolve('./runtime/server/utils')}').getNotionClient`,
          `  const handleNotionError: typeof import('${resolve(
            './runtime/server/utils',
          )}').handleNotionError`,
        ].join('\n'),
    })

    nuxt.hook('prepare:types', (options) => {
      options.references.push({ path: resolve(nuxt.options.buildDir, 'types/server-utils.d.ts') })
    })

    const apiDir = resolve(runtimeDir, 'server', 'api', 'notion')

    // Blocks paths
    const blockRoute = '/api/notion/blocks/:id'
    const blocksDir = resolve(apiDir, 'blocks')

    addServerHandler({
      route: `${blockRoute}`,
      handler: resolve(blocksDir, '[id].ts'),
    })
    addServerHandler({
      route: `${blockRoute}/children`,
      handler: resolve(blocksDir, '[id]', 'children.patch.ts'),
    })

    // Page paths
    const pagesRoute = '/api/notion/pages/:id'
    const pagesDir = resolve(apiDir, 'pages')

    addServerHandler({
      route: `${pagesRoute}`,
      handler: resolve(pagesDir, '[id].ts'),
    })
    addServerHandler({
      route: '/api/notion/pages/:page_id/properties/:property_id',
      handler: resolve(pagesDir, '[page_id]', 'properties', '[property_id].get'),
    })

    // Users paths
    const usersRoute = '/api/notion/users'
    const usersDir = resolve(apiDir, 'users')

    addServerHandler({
      route: usersRoute,
      handler: resolve(usersDir, 'users.get'),
    })
    addServerHandler({
      route: `${usersRoute}/:id`,
      handler: resolve(usersDir, '[id].get.ts'),
    })

    // Search paths
    const searchRoute = '/api/notion/search'
    const searchDir = resolve(apiDir, 'search')

    addServerHandler({
      route: searchRoute,
      handler: resolve(searchDir, 'search.post.ts'),
    })

    // Databases paths
    const databasesRoute = '/api/notion/databases/:id'
    const databasesDir = resolve(apiDir, 'databases')

    addServerHandler({
      route: databasesRoute,
      handler: resolve(databasesDir, '[id].get.ts'),
    })
    addServerHandler({
      route: databasesRoute,
      handler: resolve(databasesDir, '[id].patch.ts'),
    })
    addServerHandler({
      route: `${databasesRoute}/query`,
      handler: resolve(databasesDir, '[id]', 'query.post.ts'),
    })
  },
})
