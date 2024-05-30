import { defineNuxtPlugin, useDirectusSession } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  hooks: {
    'apollo:http-auth': async (args) => {
      const accessToken = await useDirectusSession().getToken()
      if (accessToken) {
        args.authorization = `Bearer ${accessToken}`
      }
    },
    'apollo:ws-auth': async (args) => {
      const accessToken = await useDirectusSession().getToken()
      if (accessToken) {
        args.params = {
          access_token: accessToken,
        }
      }
    },
  },
})
