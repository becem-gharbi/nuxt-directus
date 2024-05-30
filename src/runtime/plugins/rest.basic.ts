import { createDirectus, rest } from '@directus/sdk'
import type { PublicConfig } from '../types'
import { defineNuxtPlugin, useRuntimeConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.directus as PublicConfig

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl, {
    globals: {
      fetch: $fetch,
    },
  })

  const client = directus.with(rest())

  return {
    provide: {
      directus: {
        client,
      },
    },
  }
})
