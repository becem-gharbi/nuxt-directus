import { getCookie, deleteCookie } from 'h3'
import type { PublicConfig } from '../types'
import { useDirectusStorage } from './useDirectusStorage'
import {
  useRuntimeConfig,
  useDirectusAuth,
  useNuxtApp,
  useRequestEvent
} from '#imports'

let refreshTimeout: NodeJS.Timeout | null = null

export function useDirectusSession () {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }
  const event = useRequestEvent()
  const { $directus } = useNuxtApp()

  const _refreshToken = {
    get: () => process.server && getCookie(event!, config.auth.refreshTokenCookieName!),
    clear: () => process.server && deleteCookie(event!, config.auth.refreshTokenCookieName!)
  }

  const _sessionToken = {
    get: () => process.server && getCookie(event!, config.auth.sessionTokenCookieName!),
    clear: () => process.server && deleteCookie(event!, config.auth.sessionTokenCookieName!)
  }

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
    const { _onLogout } = useDirectusAuth()
    await $directus.client.refresh()
      .then(() => autoRefresh(true))
      .catch(() => {
        _refreshToken.clear()
        _sessionToken.clear()
        return _onLogout()
      })
  }

  async function getToken (): Promise<string | null | void> {
    return await $directus.client.getToken().catch(() => null)
  }

  return { refresh, getToken, autoRefresh, _loggedInFlag, _refreshToken, _sessionToken }
}
