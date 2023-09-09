import { readMe, passwordRequest, passwordReset } from '@directus/sdk'
import { joinURL, withQuery } from 'ufo'
import type { DirectusUser } from '@directus/sdk'
import type { AuthenticationData } from '../types'
import {
  useState,
  useRuntimeConfig,
  useDirectusRest,
  useRoute,
  navigateTo,
  clearNuxtData,
  useDirectusSession,
  useNuxtApp
} from '#imports'

import type { Ref } from '#imports'

export default function useDirectusAuth<DirectusSchema extends object> () {
  const user: Ref<Readonly<DirectusUser<DirectusSchema> | null>> = useState(
    'directus-user',
    () => null
  )

  const config = useRuntimeConfig().public.directus

  const { _accessToken, _loggedIn } = useDirectusSession()

  async function login (email: string, password: string, otp?: string) {
    const route = useRoute()
    const { callHook } = useNuxtApp()

    const { data } = await $fetch<AuthenticationData>('/auth/login', {
      baseURL: config.rest.baseUrl,
      method: 'POST',
      credentials: 'include',
      body: {
        mode: 'cookie',
        email,
        password,
        otp
      }
    })

    const returnToPath = route.query.redirect?.toString()
    const redirectTo = returnToPath || config.auth.redirect.home

    _accessToken.set(data.access_token)
    _loggedIn.set(true)

    // A workaround to insure access token cookie is set
    setTimeout(async () => {
      await fetchUser()
      await callHook('directus:loggedIn', true)
      await navigateTo(redirectTo)
    }, 100)
  }

  async function logout () {
    const { callHook } = useNuxtApp()

    await callHook('directus:loggedIn', false)

    await $fetch('/auth/logout', {
      baseURL: config.rest.baseUrl,
      method: 'POST',
      credentials: 'include'
    }).finally(async () => {
      _accessToken.clear()
      _loggedIn.set(false)
      user.value = null
      clearNuxtData()
      await navigateTo(config.auth.redirect.logout)
    })
  }

  async function fetchUser () {
    const fields = config.auth.userFields || ['*']
    try {
      // @ts-ignore
      user.value = await useDirectusRest(readMe({ fields }))
    } catch (error) {
      user.value = null
    }
  }

  function loginWithProvider (provider: string) {
    const route = useRoute()
    const returnToPath = route.query.redirect?.toString()
    let redirectUrl = getRedirectUrl(config.auth.redirect.callback)

    if (returnToPath) {
      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath })
    }

    if (process.client) {
      const url = withQuery(
        joinURL(config.rest.baseUrl, '/auth/login', provider),
        {
          redirect: redirectUrl
        }
      )

      window.location.replace(url)
    }
  }

  function requestPasswordReset (email: string) {
    const resetUrl = getRedirectUrl(config.auth.redirect.resetPassword)
    return useDirectusRest(passwordRequest(email, resetUrl))
  }

  function resetPassword (password: string) {
    const route = useRoute()
    const token = route.query.token as string

    return useDirectusRest(passwordReset(token, password))
  }

  function getRedirectUrl (path: string) {
    return joinURL(config.rest.nuxtBaseUrl, path)
  }

  return {
    login,
    logout,
    fetchUser,
    loginWithProvider,
    requestPasswordReset,
    resetPassword,
    user
  }
}
