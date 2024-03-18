import { fileURLToPath } from 'url'
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  logger,
  installModule,
  addImports
} from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'
import type { PublicConfig } from './runtime/types'

export interface ModuleOptions extends PublicConfig { }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'directus',
    compatibility: {
      nuxt: '^3.0.0'
    }
  },

  defaults: {
    rest: {
      baseUrl: 'http://localhost:8055',
      nuxtBaseUrl: 'http://localhost:3000'
    },
    graphql: {
      enabled: true,
      httpEndpoint: 'http://localhost:8055/graphql'
    },
    auth: {
      enabled: true,
      mode: 'cookie',
      msRefreshBeforeExpires: 10000,
      enableGlobalAuthMiddleware: false,
      refreshTokenCookieName: 'directus_refresh_token',
      sessionTokenCookieName: 'directus_session_token',
      loggedInFlagName: 'directus_logged_in',
      redirect: {
        home: '/home',
        login: '/auth/login',
        logout: '/auth/login',
        resetPassword: '/auth/reset-password',
        callback: '/auth/callback'
      }
    }
  },

  async setup (options, nuxt) {
    if (!options.rest.baseUrl) {
      logger.warn('[nuxt-directus] Please make sure to set Directus baseUrl')
    }

    if (!options.rest.nuxtBaseUrl) {
      logger.warn('[nuxt-directus] Please make sure to set Nuxt baseUrl')
    }

    // Get the runtime directory
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))

    // Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir)

    // Initialize the module options
    nuxt.options.runtimeConfig = defu(
      nuxt.options.runtimeConfig,
      {
        app: {},
        public: {
          directus: options
        }
      }
    )

    // ##############################################
    // ################# Rest setup #################
    // ##############################################

    const restPlugin = resolve(runtimeDir, options.auth.enabled ? './plugins/rest' : './plugins/rest.basic')
    addPlugin(restPlugin, { append: true })

    addImports({
      name: 'useDirectusRest',
      from: resolve(runtimeDir, './composables/useDirectusRest')
    })

    // Auto-import Directus SDK rest commands
    const commands = [
      'createComment',
      'updateComment',
      'deleteComment',
      'createField',
      'createItem',
      'createItems',
      'deleteField',
      'deleteFile',
      'deleteFiles',
      'readActivities',
      'readActivity',
      'deleteItem',
      'deleteItems',
      'deleteUser',
      'deleteUsers',
      'importFile',
      'readCollection',
      'readCollections',
      'createCollection',
      'updateCollection',
      'deleteCollection',
      'readField',
      'readFieldsByCollection',
      'readFields',
      'readFile',
      'readFiles',
      'readItem',
      'readItems',
      'readSingleton',
      'readMe',
      'createUser',
      'createUsers',
      'readUser',
      'readUsers',
      'updateField',
      'updateFile',
      'updateFiles',
      'updateFolder',
      'updateFolders',
      'updateItem',
      'updateItems',
      'updateSingleton',
      'updateMe',
      'updateUser',
      'updateUsers',
      'uploadFiles',
      'withToken',
      'aggregate'
    ]

    commands.forEach((name) => {
      addImports({
        name,
        as: name,
        from: '@directus/sdk'
      })
    })

    // ##############################################
    // ################# Auth setup #################
    // ##############################################

    if (options.auth.enabled) {
      addImports([
        {
          name: 'useDirectusAuth',
          from: resolve(runtimeDir, './composables/useDirectusAuth')
        },
        {
          name: 'useDirectusSession',
          from: resolve(runtimeDir, './composables/useDirectusSession')
        }
      ])

      const authPlugin = resolve(runtimeDir, './plugins/auth')
      addPlugin(authPlugin, { append: true })
    }

    // #################################################
    // ################# GraphQL setup #################
    // #################################################

    if (options.graphql.enabled) {
      if (options.auth.enabled && options.auth.mode === 'cookie') {
        const graphqlPlugin = resolve(runtimeDir, './plugins/graphql')
        addPlugin(graphqlPlugin, { append: true })
      }

      await installModule('nuxt-apollo', {
        httpEndpoint: options.graphql.httpEndpoint,
        wsEndpoint: options.graphql.wsEndpoint,
        proxyCookies: true,
        credentials: (options.auth.enabled && options.auth.mode === 'session') ? 'include' : 'same-origin'
      })
    }
  }
})
