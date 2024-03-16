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
  const { _loggedInFlag, refresh } = useDirectusSession()
  const { user, _onLogout } = useDirectusAuth()
  const { currentRoute } = useRouter()

  addRouteMiddleware('common', common, { global: true })
  addRouteMiddleware('auth', auth, { global: config.auth.enableGlobalAuthMiddleware })
  addRouteMiddleware('guest', guest)

  nuxtApp.hook('directus:loggedIn', (state) => {
    _loggedInFlag.value = state
  })

  const isSSO = currentRoute.value?.path === config.auth.redirect.callback && !currentRoute.value.query.reason

  if (_loggedInFlag.value || isSSO) {
    await refresh().then(useDirectusAuth().fetchUser)
  }

  if (user.value) {
    await nuxtApp.callHook('directus:loggedIn', true)
  }

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
})
