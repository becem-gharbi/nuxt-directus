import { createDirectus, rest, authentication } from '@directus/sdk'
import { splitCookiesString, appendResponseHeader } from 'h3'
import type { PublicConfig } from '../types'
import { useDirectusStorage } from '../composables/useDirectusStorage'
import { defineNuxtPlugin, useRequestHeaders, useRequestEvent } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config.public.directus as PublicConfig & { auth: { enabled: true } }
  const event = useRequestEvent()
  const reqHeaders = useRequestHeaders(['cookie'])

  const fetch = $fetch.create({
    onRequest ({ options }) {
      if (process.server) {
        options.headers = {
          ...options.headers,
          ...reqHeaders
        }
      }
    },
    onResponse ({ response }) {
      if (process.server) {
        const cookies = splitCookiesString(response.headers.get('set-cookie') ?? '')

        for (const cookie of cookies) {
          appendResponseHeader(event!, 'set-cookie', cookie)
        }
      }
    }
  })

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl, {
    globals: {
      fetch
    }
  })

  const client = directus
    .with(rest({
      credentials: config.auth.mode === 'session' ? 'include' : 'same-origin'
    }))
    .with(authentication(config.auth.mode, {
      autoRefresh: false,
      msRefreshBeforeExpires: config.auth.msRefreshBeforeExpires,
      credentials: 'include',
      storage: useDirectusStorage()
    }))

  return {
    provide: {
      directus: {
        client
      }
    }
  }
})
