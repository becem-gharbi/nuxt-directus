import type { PublicConfig } from '../types'
import { useDirectusStorage } from '../composables/useDirectusStorage'
import {
  defineNuxtPlugin,
  useDirectusSession,
  useDirectusAuth,
  useRouter,
} from '#imports'

export default defineNuxtPlugin({
  name: 'directus:auth',
  dependsOn: ['directus:rest'],
  enforce: 'post',

  setup: async (nuxtApp) => {
    const config = nuxtApp.$config.public.directus as PublicConfig & { auth: { enabled: true } }
    const { _loggedInFlag, _refreshOn, refresh, autoRefresh } = useDirectusSession()
    const { user, _onLogout, fetchUser } = useDirectusAuth()
    const { currentRoute } = useRouter()

    _refreshOn.value = 0

    nuxtApp.hook('directus:loggedIn', (state) => {
      _loggedInFlag.value = state ? 1 : 0
    })

    nuxtApp.hook('app:mounted', () => {
      window.onstorage = (event) => {
        if (event.key === config.auth.loggedInFlagName) {
          if (event.oldValue === '1' && event.newValue === '0' && user.value) {
            _onLogout()
          }
          else if (event.oldValue === '0' && event.newValue === '1') {
            location.reload()
          }
        }
      }
    })

    function isFirstTime() {
      const isPageFound = currentRoute.value?.matched.length > 0
      const isPrerenderd = typeof nuxtApp.payload.prerenderedAt === 'number'
      const isServerRendered = nuxtApp.payload.serverRendered
      return (import.meta.server && !isPrerenderd && isPageFound) || (import.meta.client && (!isServerRendered || isPrerenderd || !isPageFound))
    }

    async function isExpired() {
      const authData = await useDirectusStorage().get()
      const now = new Date().getTime()
      return !authData?.expires_at || authData.expires_at < now + config.auth.msRefreshBeforeExpires!
    }

    function canFetchUser() {
      let isSSO = false
      if (import.meta.client) {
        const path = window.location.pathname
        const params = new URLSearchParams(window.location.search)
        isSSO = path === config.auth.redirect.callback && !params.has('reason')
      }
      else {
        isSSO = currentRoute.value?.path === config.auth.redirect.callback && !currentRoute.value.query.reason
      }
      const { _loggedInFlag, _refreshToken, _sessionToken } = useDirectusSession()
      return isSSO || _loggedInFlag.value || _refreshToken.get() || _sessionToken.get()
    }

    if (isFirstTime() && canFetchUser()) {
      const expired = await isExpired()
      if (expired) await refresh().then(b => b ? fetchUser() : null)
      else await fetchUser()
    }

    if (user.value) {
      await autoRefresh(true)
      await nuxtApp.callHook('directus:loggedIn', true)
    }
    else {
      _loggedInFlag.value = 0
    }
  },
})
