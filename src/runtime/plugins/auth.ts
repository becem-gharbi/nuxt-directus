import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useDirectusAuth,
  useRoute,
  useDirectusSession,
  useNuxtApp
} from '#imports'

export default defineNuxtPlugin(async () => {
  try {
    const config = useRuntimeConfig().public.directus

    addRouteMiddleware('common', common, { global: true })

    addRouteMiddleware('auth', auth, {
      global: config.auth.enableGlobalAuthMiddleware
    })

    addRouteMiddleware('guest', guest)

    const initialized = useState('directus-auth-initialized', () => false)

    const { _loggedIn } = useDirectusSession()

    if (initialized.value === false) {
      const { path } = useRoute()

      const { fetchUser } = useDirectusAuth()
      const { _refreshToken, _accessToken, refresh } = useDirectusSession()

      if (_accessToken.get()) {
        await fetchUser()
      } else {
        const isCallback = path === config.auth.redirect.callback
        const isLoggedIn = _loggedIn.get() === 'true'

        if (isCallback || isLoggedIn || _refreshToken.get()) {
          await refresh()
          if (_accessToken.get()) {
            await fetchUser()
          }
        }
      }
    }

    initialized.value = true

    const { user } = useDirectusAuth()
    const nuxtApp = useNuxtApp()

    if (user.value) {
      _loggedIn.set(true)
      await nuxtApp.callHook('directus:loggedIn', true)
    } else {
      _loggedIn.set(false)
    }

    nuxtApp.hook('app:mounted', () => {
      addEventListener('storage', (event) => {
        const loggedInName = config.auth.loggedInFlagName

        if (event.key === loggedInName) {
          if (event.oldValue === 'true' && event.newValue === 'false') {
            useDirectusAuth()._onLogout()
          }
        }
      })
    })
  } catch (e) {}
})
