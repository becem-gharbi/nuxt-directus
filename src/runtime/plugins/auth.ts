import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import type { PublicConfig } from '../types'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useDirectusSession,
  useDirectusAuth,
  useRouter
} from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = nuxtApp.$config.public.directus as PublicConfig & { auth: { enabled: true } }
  const { _loggedInFlag, _refreshToken, _sessionToken, refresh, getToken, autoRefresh } = useDirectusSession()
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
      if (config.auth.mode === 'cookie') {
        await refresh().then(getToken).then(t => t ? fetchUser() : null)
      } else if (config.auth.mode === 'session') {
        // TODO: avoid refresh if token not expired
        await refresh().then(fetchUser)
      }
    }
  }

  if (user.value) {
    await autoRefresh(true)
    await nuxtApp.callHook('directus:loggedIn', true)
  } else {
    _loggedInFlag.value = false
  }
})
