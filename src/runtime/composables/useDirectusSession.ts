import type { PublicConfig } from '../types'
import { useDirectusStorage } from './useDirectusStorage'
import {
  useRuntimeConfig,
  useDirectusAuth,
  useNuxtApp
} from '#imports'

let refreshTimeout: NodeJS.Timeout | null = null

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

  async function autoRefresh (enabled: boolean) {
    if (process.server) {
      return
    }

    if (!enabled) {
      return refreshTimeout && clearTimeout(refreshTimeout)
    }

    const authData = await useDirectusStorage().get()

    if (authData?.expires && authData.expires > config.auth.msRefreshBeforeExpires! && authData.expires < Number.MAX_SAFE_INTEGER) {
      refreshTimeout && clearTimeout(refreshTimeout)

      refreshTimeout = setTimeout(refresh, authData.expires - config.auth.msRefreshBeforeExpires!)
    }
  }

  async function refresh () {
    await useNuxtApp().$directus.client.refresh()
      .then(() => autoRefresh(true))
      .catch(useDirectusAuth()._onLogout)
  }

  async function getToken (): Promise<string | null> {
    return await useNuxtApp().$directus.client.getToken()
  }

  return { refresh, getToken, autoRefresh, _loggedInFlag }
}
