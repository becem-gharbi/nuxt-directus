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

    const now = new Date().getTime()
    const delay = (authData?.expires_at ?? 0) - now - config.auth.msRefreshBeforeExpires!

    if (delay > 0) {
      refreshTimeout && clearTimeout(refreshTimeout)
      refreshTimeout = setTimeout(refresh, delay)
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
