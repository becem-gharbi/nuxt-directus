import { useDirectusToken } from '../composables/useDirectusToken'
import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo
} from '#imports'

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig().public.directus

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
