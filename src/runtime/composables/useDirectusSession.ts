import { getCookie, deleteCookie } from 'h3'
import type { PublicConfig } from '../types'
import { getLocalStorageNumber, setLocalStorageNumber } from '../utils'
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
      return getLocalStorageNumber(config.auth.loggedInFlagName!)
    },
    set value (v) {
      setLocalStorageNumber(config.auth.loggedInFlagName!, v)
    }
  }

  const _refreshOn = {
    get value () {
      return getLocalStorageNumber('directus_refresh_on')
    },
    set value (v) {
      setLocalStorageNumber('directus_refresh_on', v)
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
    if (config.auth.mode === 'session' && _refreshOn.value) {
      return new Promise<boolean>((resolve) => {
        const timeout = setTimeout(async () => {
          await autoRefresh(true)
          clearTimeout(timeout)
          resolve(true)
        }, config.auth.msRefreshBeforeExpires!)
      })
    }

    _refreshOn.value = 1

    const { _onLogout } = useDirectusAuth()

    return await $directus.client.refresh()
      .then(() => autoRefresh(true).then(() => true))
      .catch(() => {
        _refreshToken.clear()
        _sessionToken.clear()
        return _onLogout().then(() => false)
      })
      .finally(() => {
        _refreshOn.value = 0
      })
  }

  async function getToken (): Promise<string | null | void> {
    return await $directus.client.getToken().catch(() => null)
  }

  return { refresh, getToken, autoRefresh, _loggedInFlag, _refreshToken, _sessionToken, _refreshOn }
}
