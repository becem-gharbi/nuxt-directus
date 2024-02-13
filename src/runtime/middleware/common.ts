import { useDirectusToken } from '../composables/useDirectusToken'
import type { PublicConfig } from '../types'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

  if (
    to.path === config.auth.redirect.login ||
    to.path === config.auth.redirect.callback
  ) {
    if (useDirectusToken().value) {
      const returnToPath = from.query.redirect?.toString()
      const redirectTo = returnToPath ?? config.auth.redirect.home
      return navigateTo(redirectTo)
    }
  }
})
