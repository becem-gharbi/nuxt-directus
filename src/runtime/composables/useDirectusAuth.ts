import { readMe, passwordRequest, passwordReset } from '@directus/sdk'
import { joinURL, withQuery } from 'ufo'
import type { DirectusUser } from '@directus/sdk'
import type { Ref } from 'vue'
import type { PublicConfig } from '../types'
import {
  useState,
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useNuxtApp,
  useDirectusSession,
} from '#imports'

export function useDirectusAuth<DirectusSchema extends object>() {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

  const user: Ref<Readonly<DirectusUser<DirectusSchema> | null>> = useState(
    'directus-auth-user',
    () => null,
  )

  const { autoRefresh } = useDirectusSession()
  const { callHook, $directus } = useNuxtApp()

  async function login(email: string, password: string, otp?: string) {
    await useNuxtApp().$directus.client.login(email, password, { otp }).then(_onLogin)
  }

  async function logout() {
    await useNuxtApp().$directus.client.logout().finally(_onLogout)
  }

  async function fetchUser() {
    const fields = config.auth.userFields ?? ['*']
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    user.value = await $directus.client.request(readMe({ fields })).catch(() => null)
  }

  function loginWithProvider(provider: string) {
    const returnToPath = useRoute().query.redirect?.toString()
    let redirectUrl = getRedirectUrl(config.auth.redirect.callback)

    if (returnToPath) {
      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath })
    }

    return navigateTo({
      path: joinURL(config.rest.baseUrl, '/auth/login', provider),
      query: {
        redirect: redirectUrl,
      },
    },
    {
      external: true,
    })
  }

  async function requestPasswordReset(email: string) {
    const resetUrl = getRedirectUrl(config.auth.redirect.resetPassword)
    return await $directus.client.request(passwordRequest(email, resetUrl))
  }

  async function resetPassword(password: string) {
    const token = useRoute().query.token as string
    return await $directus.client.request(passwordReset(token, password))
  }

  function getRedirectUrl(path: string) {
    return joinURL(config.rest.nuxtBaseUrl, path)
  }

  async function _onLogin() {
    await fetchUser()
    if (user.value) {
      const returnToPath = useRoute().query.redirect?.toString()
      const decodedReturnToPath = returnToPath && decodeURIComponent(returnToPath)
      const redirectTo = decodedReturnToPath ?? config.auth.redirect.home
      await autoRefresh(true)
      await callHook('directus:loggedIn', true)
      await navigateTo(redirectTo)
    }
  }

  async function _onLogout() {
    await autoRefresh(false)
    await callHook('directus:loggedIn', false)
    if (import.meta.client) {
      await navigateTo(config.auth.redirect.logout, { external: true })
    }
  }

  return {
    login,
    logout,
    fetchUser,
    loginWithProvider,
    requestPasswordReset,
    resetPassword,
    _onLogout,
    user,
  }
}
