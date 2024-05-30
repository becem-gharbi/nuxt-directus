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

  if (useDirectusAuth().user.value) {
    return navigateTo(config.auth.redirect.home)
  }
})
