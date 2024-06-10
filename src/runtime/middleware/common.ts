import type { PublicConfig } from '../types'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useDirectusAuth,
} from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

  if (
    to.path === config.auth.redirect.login
    || to.path === config.auth.redirect.callback
  ) {
    if (useDirectusAuth().user.value) {
      const returnToPath = from.query.redirect?.toString()
      const decodedReturnToPath = returnToPath && decodeURIComponent(returnToPath)
      const redirectTo = decodedReturnToPath ?? config.auth.redirect.home
      return navigateTo(redirectTo)
    }
  }
})
