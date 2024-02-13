import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // @ts-ignore
  modules: ['../src/module'],
  ssr: true,
  directus: {
    auth: {
      enabled: true,
      userFields: ['first_name', 'last_name']
    }
  }
})
