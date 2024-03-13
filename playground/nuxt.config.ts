import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // @ts-ignore
  modules: ['../src/module'],
  ssr: true,
  directus: {
    auth: {
      enabled: true,
      userFields: ['first_name', 'last_name'],
      enableGlobalAuthMiddleware: false,
      redirect: {
        login: '/auth/login',
        callback: '/auth/callback',
        resetPassword: '/auth/reset-password',
        home: '/home',
        logout: '/auth/login'
      }
    }
  }
})
