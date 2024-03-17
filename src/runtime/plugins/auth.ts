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
  const { _loggedInFlag, refresh, getToken } = useDirectusSession()
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

  if (_loggedInFlag.value || isSSO) {
    if (config.auth.mode === 'cookie') {
      await refresh().then(getToken).then(t => t ? fetchUser() : null)
    } else if (config.auth.mode === 'session') {
      await refresh().then(fetchUser)
    }
  }

  if (user.value) {
    await nuxtApp.callHook('directus:loggedIn', true)
  } else {
    _loggedInFlag.value = false
  }
})
