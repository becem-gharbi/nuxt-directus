import {defineNuxtPlugin} from '#imports'

export default defineNuxtPlugin({
  enforce: 'pre',
  hooks: {
    'directus:loggedIn': state => console.log(`LoggedIn ${state}`)
  }
})
