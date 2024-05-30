import type { RestClient, DirectusClient, AuthenticationClient } from '@directus/sdk'

declare module '#app' {
  interface NuxtApp {
    $directus: {
      client: DirectusClient<DirectusSchema> & RestClient<DirectusSchema> & AuthenticationClient<DirectusSchema>
    }
  }
  interface RuntimeNuxtHooks {
    'directus:loggedIn': (state: boolean) => void
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $directus: {
      client: DirectusClient<DirectusSchema> & RestClient<DirectusSchema> & AuthenticationClient<DirectusSchema>
    }
  }
}

declare global {
  interface DirectusSchema {}
}

export {}
