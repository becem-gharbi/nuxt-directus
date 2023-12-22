import {
  deleteCookie,
  getCookie,
  splitCookiesString,
  appendResponseHeader
} from 'h3'

import type { AuthenticationData } from '../types'
import {
  useRequestEvent,
  useRuntimeConfig,
  useState,
  useRequestHeaders,
  navigateTo,
  useDirectusToken
} from '#imports'

export function useDirectusSession () {
  const event = useRequestEvent()
  const config = useRuntimeConfig().public.directus
  const token = useDirectusToken()

  const refreshTokenCookieName = config.auth.refreshTokenCookieName
  const loggedInName = config.auth.loggedInFlagName

  const _refreshToken = {
    get: () => process.server && getCookie(event, refreshTokenCookieName),
    clear: () => process.server && deleteCookie(event, refreshTokenCookieName)
  }

  const _loggedIn = {
    get: () => process.client && localStorage.getItem(loggedInName),
    set: (value: boolean) =>
      process.client && localStorage.setItem(loggedInName, value.toString())
  }

  async function refresh () {
    const isRefreshOn = useState('directus-refresh-loading', () => false)
    const user = useState('directus-user')

    if (isRefreshOn.value) {
      return
    }

    isRefreshOn.value = true

    const headers = useRequestHeaders(['cookie'])

    await $fetch
      .raw<AuthenticationData>('/auth/refresh', {
        baseURL: config.rest.baseUrl,
        method: 'POST',
        credentials: 'include',
        body: {
          mode: 'cookie'
        },
        headers
      })
      .then((res) => {
        const setCookie = res.headers.get('set-cookie') ?? ''
        const cookies = splitCookiesString(setCookie)
        for (const cookie of cookies) {
          appendResponseHeader(event, 'set-cookie', cookie)
        }
        if (res._data) {
          token.value = {
            access_token: res._data.data.access_token,
            expires: new Date().getTime() + res._data.data.expires
          }
          _loggedIn.set(true)
        }
        isRefreshOn.value = false
        return res
      })
      .catch(async () => {
        isRefreshOn.value = false
        token.value = null
        _refreshToken.clear()
        _loggedIn.set(false)
        user.value = null
        if (process.client) {
          await navigateTo(config.auth.redirect.logout)
        }
      })
  }

  async function getToken (): Promise<string | null | undefined> {
    if (token.expired) {
      await refresh()
    }

    return token.value?.access_token
  }

  return { refresh, getToken, _refreshToken, _loggedIn }
}
