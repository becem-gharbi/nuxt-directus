import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
  ssr: process.env.NUXT_SSR !== 'false',

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-12-29',

  vite: {
    logLevel: 'silent',
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        module: 'ESNext',
      },
    },
  },

  directus: {
    auth: {
      enabled: true,
      mode: process.env.NUXT_PUBLIC_DIRECTUS_AUTH_MODE as 'session' | 'cookie',
      enableGlobalAuthMiddleware: true,
      refreshTokenCookieName: 'directus_refresh_token',
      sessionTokenCookieName: 'directus_session_token',
      loggedInFlagName: 'directus_logged_in',
      msRefreshBeforeExpires: 5000,
      redirect: {
        login: '/auth/login',
        callback: '/auth/callback',
        resetPassword: '/auth/reset-password',
        home: '/home',
        logout: '/auth/login',
      },
    },
    graphql: {
      enabled: true,
      httpEndpoint: 'http://localhost:8055/graphql',
      wsEndpoint: 'ws://localhost:8055/graphql',
    },
  },
})
