import { defineNuxtPlugin, useDirectusSession } from '#imports'

// TODO: allow cookie-based authorization in `nuxt-apollo`
export default defineNuxtPlugin({
  enforce: 'pre',
  hooks: {
    'apollo:http-auth': async (args) => {
      const accessToken = await useDirectusSession().getToken()

      args.token = accessToken ?? ''
    },
    'apollo:ws-auth': async (args) => {
      const accessToken = await useDirectusSession().getToken()

      args.params = {
        access_token: accessToken ?? ''
      }
    }
  }
})
