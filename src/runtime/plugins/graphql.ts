import { defineNuxtPlugin, useDirectusSession } from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  hooks: {
    'apollo:http-auth': async (args) => {
      const { getToken } = useDirectusSession()

      const accessToken = await getToken()

      args.token = accessToken || null
    },
    'apollo:ws-auth': async (args) => {
      const { getToken } = useDirectusSession()

      const accessToken = await getToken()

      args.params = {
        access_token: accessToken || null
      }
    }
  }
})
