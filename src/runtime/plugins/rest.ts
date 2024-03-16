import { createDirectus, rest, authentication } from '@directus/sdk'
import type { PublicConfig } from '../types'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const config = nuxtApp.$config.public.directus as PublicConfig & { auth: { enabled: true } }

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl, {
    globals: {
      fetch: $fetch
    }
  })

  const client = directus
    .with(rest())
    .with(authentication('cookie', {
      autoRefresh: true,
      msRefreshBeforeExpires: config.auth.msRefreshBeforeExpires,
      credentials: 'include'
    }))

  return {
    provide: {
      directus: {
        client
      }
    }
  }
})
