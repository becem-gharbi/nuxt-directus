import {
  deleteCookie,
  getCookie,
  splitCookiesString,
  appendResponseHeader
} from 'h3'
import type { AuthenticationData } from '../types'
import { useDirectusToken } from './useDirectusToken'
import {
  useRequestEvent,
  useRuntimeConfig,
  useState,
  useRequestHeaders,
  useDirectusAuth
} from '#imports'

export function useDirectusSession () {
  const event = useRequestEvent()
  const config = useRuntimeConfig().public.directus

  const _refreshToken = {
    get: () => process.server && getCookie(event, config.auth.refreshTokenCookieName),
    clear: () => process.server && deleteCookie(event, config.auth.refreshTokenCookieName)
  }

  const _loggedInFlag = {
    get value () {
      if (process.client) {
        return localStorage.getItem(config.auth.loggedInFlagName) === 'true'
      }
      return false
    },
    set value (value: boolean) {
      process.client && localStorage.setItem(config.auth.loggedInFlagName, value.toString())
    }
  }

  async function refresh () {
    const isRefreshOn = useState('directus-auth-refresh-loading', () => false)

    if (isRefreshOn.value && process.client) {
      // Wait until previous refresh call is completed
      while (isRefreshOn.value) {
        let timeoutId
        await new Promise((resolve) => { timeoutId = setTimeout(resolve, 200) })
        clearTimeout(timeoutId)
      }
      return
    }
    isRefreshOn.value = true

    const accessToken = useDirectusToken()

    await $fetch
      .raw<AuthenticationData>('/auth/refresh', {
        baseURL: config.rest.baseUrl,
        method: 'POST',
        credentials: 'include',
        body: { mode: 'cookie' },
        headers: process.server ? useRequestHeaders(['cookie']) : {}
      })
      .then((res) => {
        if (process.server) {
          const cookies = splitCookiesString(res.headers.get('set-cookie') ?? '')

          for (const cookie of cookies) {
            appendResponseHeader(event, 'set-cookie', cookie)
          }
        }
        if (res._data) {
          accessToken.value = {
            access_token: res._data.data.access_token,
            expires: new Date().getTime() + res._data.data.expires
          }
        }
        return res
      })
      .catch(async () => {
        _refreshToken.clear()
        await useDirectusAuth()._onLogout()
      }).finally(() => {
        isRefreshOn.value = false
      })
  }

  /**
   * Async get access token
   * @returns Fresh access token (refreshed if expired)
   */
  async function getToken (): Promise<string | null | undefined> {
    const accessToken = useDirectusToken()

    if (accessToken.expired) {
      await refresh()
    }

    return accessToken.value?.access_token
  }

  return { refresh, getToken, _refreshToken, _loggedInFlag }
}
