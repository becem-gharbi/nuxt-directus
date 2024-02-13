import { createDirectus, rest } from '@directus/sdk'
import type { PublicConfig } from '../types'
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useDirectusSession
} from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.directus as PublicConfig

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl, {
    globals: {
      fetch: $fetch
    }
  })

  const restClient = directus.with(
    rest({
      onRequest: async (request) => {
        if (config.auth.enabled) {
          const accessToken = await useDirectusSession().getToken()

          if (accessToken) {
            request.headers = {
              ...request.headers,
              authorization: `Bearer ${accessToken}`
            }
          }
        }

        return request
      }
    })
  )

  return {
    provide: {
      directus: {
        rest: restClient
      }
    }
  }
})
