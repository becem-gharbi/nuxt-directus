import { defineNuxtPlugin, useDirectusSession } from '#imports'

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
