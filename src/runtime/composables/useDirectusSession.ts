import type { PublicConfig } from '../types'
import {
  useRuntimeConfig,
  useDirectusAuth,
  useNuxtApp
} from '#imports'

export function useDirectusSession () {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

  const _loggedInFlag = {
    get value () {
      return !!process.client && localStorage.getItem(config.auth.loggedInFlagName!) === 'true'
    },
    set value (value) {
      process.client && localStorage.setItem(config.auth.loggedInFlagName!, value.toString())
    }
  }

  async function refresh () {
    await useNuxtApp().$directus.client.refresh()
      .catch(useDirectusAuth()._onLogout)
  }

  async function getToken (): Promise<string | null> {
    return await useNuxtApp().$directus.client.getToken()
  }

  return { refresh, getToken, _loggedInFlag }
}
