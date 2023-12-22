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
  navigateTo
} from '#imports'

export function useDirectusSession () {
  const event = useRequestEvent()
  const config = useRuntimeConfig().public.directus
  const token = useDirectusToken()

  const _refreshToken = {
    get: () => process.server && getCookie(event, config.auth.refreshTokenCookieName),
    clear: () => process.server && deleteCookie(event, config.auth.refreshTokenCookieName)
  }

  const _loggedIn = {
    get: () => process.client && localStorage.getItem(config.auth.loggedInFlagName),
    set: (value: boolean) => process.client && localStorage.setItem(config.auth.loggedInFlagName, value.toString())
  }

  async function refresh () {
    const isRefreshOn = useState('directus-auth-refresh-loading', () => false)
    const user = useState('directus-auth-user')

    if (isRefreshOn.value) { return }

    isRefreshOn.value = true

    const headers = useRequestHeaders(['cookie'])

    await $fetch
      .raw<AuthenticationData>('/auth/refresh', {
        baseURL: config.rest.baseUrl,
        method: 'POST',
        credentials: 'include',
        body: { mode: 'cookie' },
        headers
      })
      .then((res) => {
        isRefreshOn.value = false
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
