import { useDirectusToken } from '../composables/useDirectusToken'
import type { PublicConfig } from '../types'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

  if (
    to.path === config.auth.redirect.login ||
    to.path === config.auth.redirect.callback
  ) {
    return
  }

  if (useDirectusToken().value) {
    return navigateTo(config.auth.redirect.home)
  }
})
