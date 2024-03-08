import common from '../middleware/common'
import auth from '../middleware/auth'
import guest from '../middleware/guest'
import { useDirectusToken } from '../composables/useDirectusToken'
import type { PublicConfig } from '../types'
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useDirectusAuth,
  useRoute,
  useDirectusSession
} from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }

    addRouteMiddleware('common', common, { global: true })
    addRouteMiddleware('auth', auth, { global: config.auth.enableGlobalAuthMiddleware })
    addRouteMiddleware('guest', guest)

    const { _loggedInFlag } = useDirectusSession()
    const token = useDirectusToken()

    const isPrerenderd = typeof nuxtApp.payload.prerenderedAt === 'number'
    const isServerRendered = nuxtApp.payload.serverRendered
    const firstTime = (process.server && !isPrerenderd) || (process.client && (!isServerRendered || isPrerenderd))

    if (firstTime) {
      if (token.value) {
        await useDirectusAuth().fetchUser()
      } else {
        const isCallback = useRoute().path === config.auth.redirect.callback
        const { _refreshToken, _sessionToken, refresh } = useDirectusSession()

        if (isCallback || _loggedInFlag.value || _refreshToken.get() || _sessionToken.get()) {
          await refresh()
          if (token.value) {
            await useDirectusAuth().fetchUser()
          }
        }
      }
    }

    if (token.value) {
      _loggedInFlag.value = true
      await nuxtApp.callHook('directus:loggedIn', true)
    } else {
      _loggedInFlag.value = false
    }

    nuxtApp.hook('app:mounted', () => {
      addEventListener('storage', (event) => {
        if (event.key === config.auth.loggedInFlagName) {
          if (event.oldValue === 'true' && event.newValue === 'false' && token.value) {
            useDirectusAuth()._onLogout()
          } else if (event.oldValue === 'false' && event.newValue === 'true') {
            location.reload()
          }
        }
      })
    })
  } catch (e) {}
})
