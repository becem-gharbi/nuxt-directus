import type { AuthenticationStorage, AuthenticationData } from '@directus/sdk'
import { jwtDecode } from 'jwt-decode'
import type { PublicConfig } from '../types'
import { getLocalStorageNumber, setLocalStorageNumber } from '../utils'
import { useRuntimeConfig, useState, useDirectusSession } from '#imports'

function memoryStorage() {
  let store: AuthenticationData | null = null
  return {
    get value() {
      return store
    },
    set value(data: AuthenticationData | null) {
      if (import.meta.client) {
        store = data
      }
    },
  }
}

const memory = memoryStorage()

export function useDirectusStorage() {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }
  const state = useState<AuthenticationData | null>('directus-auth-store', () => null)

  if (import.meta.client && state.value) {
    if (config.auth.mode === 'cookie') {
      memory.value = { ...state.value }
    }
    else if (config.auth.mode === 'session') {
      setLocalStorageNumber('directus_expires', state.value.expires)
      setLocalStorageNumber('directus_expires_at', state.value.expires_at)
    }
    state.value = null
  }

  if (import.meta.server && !state.value) {
    const sessionToken = useDirectusSession()._sessionToken.get()
    if (sessionToken) {
      const { exp } = jwtDecode(sessionToken)
      state.value = {
        expires_at: exp ? exp * 1000 : null,
        access_token: null,
        expires: null,
        refresh_token: null,
      }
    }
  }

  const storage: AuthenticationStorage = {
    get() {
      if (import.meta.client) {
        if (config.auth.mode === 'cookie') {
          return {
            access_token: memory.value?.access_token ?? null,
            expires: memory.value?.expires ?? null,
            expires_at: memory.value?.expires_at ?? null,
            refresh_token: null,
          }
        }
        else if (config.auth.mode === 'session') {
          return {
            access_token: null,
            expires: getLocalStorageNumber('directus_expires'),
            expires_at: getLocalStorageNumber('directus_expires_at'),
            refresh_token: null,
          }
        }
      }
      return {
        access_token: state.value?.access_token ?? null,
        expires: state.value?.expires ?? null,
        expires_at: state.value?.expires_at ?? null,
        refresh_token: null,
      }
    },
    set(data) {
      if (import.meta.client) {
        if (config.auth.mode === 'cookie') {
          memory.value = {
            access_token: data?.access_token ?? null,
            expires: data?.expires ?? null,
            expires_at: data?.expires_at ?? null,
            refresh_token: null,
          }
        }
        else if (config.auth.mode === 'session') {
          setLocalStorageNumber('directus_expires', data?.expires)
          setLocalStorageNumber('directus_expires_at', data?.expires_at)
        }
      }
      else {
        state.value = {
          access_token: data?.access_token ?? null,
          expires: data?.expires ?? null,
          expires_at: data?.expires_at ?? null,
          refresh_token: null,
        }
      }
    },
  }

  return storage
}
