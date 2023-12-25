import { useDirectusToken } from '../composables/useDirectusToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.directus

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
