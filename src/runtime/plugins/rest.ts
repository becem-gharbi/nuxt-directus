import { createDirectus, rest, authentication } from '@directus/sdk'
import type { PublicConfig } from '../types'
import { useDirectusStorage } from '../composables/useDirectusStorage'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config.public.directus as PublicConfig & { auth: { enabled: true } }

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl, {
    globals: {
      fetch: $fetch
    }
  })

  const client = directus
    .with(rest({ credentials: 'include' }))
    .with(authentication(config.auth.mode, {
      autoRefresh: true,
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
