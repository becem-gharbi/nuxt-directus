import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import type { PublicConfig } from '../types'
import { useDirectusStorage } from '../composables/useDirectusStorage'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useDirectusSession,
  useDirectusAuth,
  useRouter
} from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = nuxtApp.$config.public.directus as PublicConfig & { auth: { enabled: true } }
  const { _loggedInFlag, _refreshToken, _sessionToken, refresh, autoRefresh } = useDirectusSession()
  const { user, _onLogout, fetchUser } = useDirectusAuth()
  const { currentRoute } = useRouter()

  addRouteMiddleware('common', common, { global: true })
  addRouteMiddleware('auth', auth, { global: config.auth.enableGlobalAuthMiddleware })
  addRouteMiddleware('guest', guest)

  nuxtApp.hook('directus:loggedIn', (state) => {
    _loggedInFlag.value = state
  })

  nuxtApp.hook('app:mounted', () => {
    addEventListener('storage', (event) => {
      if (event.key === config.auth.loggedInFlagName) {
        if (event.oldValue === 'true' && event.newValue === 'false' && user.value) {
          _onLogout()
        } else if (event.oldValue === 'false' && event.newValue === 'true') {
          location.reload()
        }
      }
    })
  })

  const isSSO = currentRoute.value?.path === config.auth.redirect.callback && !currentRoute.value.query.reason
  const isPageFound = currentRoute.value?.matched.length > 0
  const isPrerenderd = typeof nuxtApp.payload.prerenderedAt === 'number'
  const isServerRendered = nuxtApp.payload.serverRendered
  const firstTime = (process.server && !isPrerenderd && isPageFound) || (process.client && (!isServerRendered || isPrerenderd || !isPageFound))

  if (firstTime) {
    if (isSSO || _loggedInFlag.value || _refreshToken.get() || _sessionToken.get()) {
      const authData = await useDirectusStorage().get()
      const now = new Date().getTime()
      const expired = !authData?.expires_at || authData.expires_at < now + config.auth.msRefreshBeforeExpires!

      expired ? await refresh().then(b => b ? fetchUser() : null) : await fetchUser()
    }
  }

  if (user.value) {
    await autoRefresh(true)
    await nuxtApp.callHook('directus:loggedIn', true)
  } else {
    _loggedInFlag.value = false
  }
})
