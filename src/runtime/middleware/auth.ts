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

  const isPageFound = to.matched.length > 0

  if (!isPageFound && process.server) {
    return
  }

  if (config.auth.enableGlobalAuthMiddleware === true) {
    if (to.meta.auth === false) {
      return
    }
  }

  if (!useDirectusToken().value) {
    return navigateTo({
      path: config.auth.redirect.login,
      query: { redirect: to.path }
    })
  }
})
