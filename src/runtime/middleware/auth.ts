import type { PublicConfig } from '../types'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useDirectusAuth,
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

  if (
    to.path === config.auth.redirect.login
    || to.path === config.auth.redirect.callback
  ) {
    return
  }

  const isPageFound = to.matched.length > 0

  if (!isPageFound && import.meta.server) {
    return
  }

  if (config.auth.enableGlobalAuthMiddleware && to.meta.auth === false) {
    return
  }

  if (!useDirectusAuth().user.value) {
    return navigateTo({
      path: config.auth.redirect.login,
      query: { redirect: to.path },
    })
  }
})
