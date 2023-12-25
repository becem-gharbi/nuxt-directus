import { readMe, passwordRequest, passwordReset } from '@directus/sdk'
import { joinURL, withQuery } from 'ufo'
import type { DirectusUser } from '@directus/sdk'
import type { AuthenticationData } from '../types'
import { useDirectusToken } from './useDirectusToken'
import type { Ref } from '#imports'
import {
  useState,
  useRuntimeConfig,
  useDirectusRest,
  useRoute,
  navigateTo,
  useDirectusSession,
  useNuxtApp
} from '#imports'

export function useDirectusAuth<DirectusSchema extends object> () {
  const config = useRuntimeConfig().public.directus

  const user: Ref<Readonly<DirectusUser<DirectusSchema> | null>> = useState(
    'directus-auth-user',
    () => null
  )

  async function login (email: string, password: string, otp?: string) {
    const res = await $fetch<AuthenticationData>('/auth/login', {
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

    useDirectusToken().value = {
      access_token: res.data.access_token,
      expires: new Date().getTime() + res.data.expires
    }

    await _onLogin()
  }

  async function logout () {
    await $fetch('/auth/logout', {
      baseURL: config.rest.baseUrl,
      method: 'POST',
      credentials: 'include'
    }).finally(_onLogout)
  }

  async function fetchUser () {
    const fields = config.auth.userFields ?? ['*']
    try {
      // @ts-ignore
      user.value = await useDirectusRest(readMe({ fields }))
    } catch (error) {
      user.value = null
    }
  }

  function loginWithProvider (provider: string) {
    const returnToPath = useRoute().query.redirect?.toString()
    let redirectUrl = getRedirectUrl(config.auth.redirect.callback)

    if (returnToPath) {
      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath })
    }

    return navigateTo({
      path: joinURL(config.rest.baseUrl, '/auth/login', provider),
      query: {
        redirect: redirectUrl
      }
    },
    {
      external: true
    })
  }

  function requestPasswordReset (email: string) {
    const resetUrl = getRedirectUrl(config.auth.redirect.resetPassword)
    return useDirectusRest(passwordRequest(email, resetUrl))
  }

  function resetPassword (password: string) {
    const token = useRoute().query.token as string

    return useDirectusRest(passwordReset(token, password))
  }

  function getRedirectUrl (path: string) {
    return joinURL(config.rest.nuxtBaseUrl, path)
  }

  async function _onLogin () {
    await fetchUser()
    if (user.value === null) { return }
    const returnToPath = useRoute().query.redirect?.toString()
    const redirectTo = returnToPath ?? config.auth.redirect.home
    useDirectusSession()._loggedInFlag.value = true
    await useNuxtApp().callHook('directus:loggedIn', true)
    await navigateTo(redirectTo)
  }

  async function _onLogout () {
    await useNuxtApp().callHook('directus:loggedIn', false)
    useDirectusToken().value = null
    useDirectusSession()._loggedInFlag.value = false
    await navigateTo(config.auth.redirect.logout, { external: true })
  }

  return {
    login,
    logout,
    fetchUser,
    loginWithProvider,
    requestPasswordReset,
    resetPassword,
    _onLogout,
    user
  }
}
