import { createDirectus, rest } from '@directus/sdk'
import { getResponseHeader } from 'h3'
import type { PublicConfig } from '../types'
import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useDirectusSession,
  useRequestEvent
} from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }
  const event = useRequestEvent()

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl, {
    globals: {
      fetch: $fetch
    }
  })

  const restClient = directus.with(
    rest({
      // TODO: make sure this is valid on Cloudflare
      credentials: config.auth.mode === 'session' && process.client ? 'include' : 'same-origin',

      onRequest: async (request) => {
        const accessToken = await useDirectusSession().getToken()

        if (accessToken) {
          if (config.auth.mode === 'cookie') {
            request.headers = {
              ...request.headers,
              authorization: `Bearer ${accessToken}`
            }
          } else if (config.auth.mode === 'session') {
            request.headers = {
              ...request.headers,
              ...(process.server ? { cookie: getResponseHeader(event!, 'Set-Cookie')?.toString() } : {})
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
