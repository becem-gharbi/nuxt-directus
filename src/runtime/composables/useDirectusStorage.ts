import type { AuthenticationStorage } from '@directus/sdk'
import { jwtDecode } from 'jwt-decode'
import type { PublicConfig } from '../types'
import { useRuntimeConfig, useState, useDirectusSession } from '#imports'

function memoryStorage () {
  let store: Record<string, any> | null = null
  return {
    get value () {
      return store
    },
    set value (data: Record<string, any> | null) {
      if (process.client) { store = data }
    }
  }
}

const memory = memoryStorage()

const getLocalStorageNumber = (key:string) => parseInt(localStorage.getItem(key) ?? '') || null
const setLocalStorageNumber = (key: string, value: number | null | undefined) => {
  value ? localStorage.setItem(key, value.toString()) : localStorage.removeItem(key)
}

export function useDirectusStorage () {
  const config = useRuntimeConfig().public.directus as PublicConfig & { auth: { enabled: true } }
  const state = useState<Record<string, any> | null>('directus-auth-store', () => null)

  if (process.client && state.value) {
    if (config.auth.mode === 'cookie') {
      memory.value = { ...state.value }
    } else if (config.auth.mode === 'session') {
      setLocalStorageNumber('directus_expires', state.value.expires)
      setLocalStorageNumber('directus_expires_at', state.value.expires_at)
    }
    state.value = null
  }

  if (process.server && !state.value) {
    const sessionToken = useDirectusSession()._sessionToken.get()
    if (sessionToken) {
      const { exp } = jwtDecode(sessionToken)
      state.value = {
        expires_at: exp ? exp * 1000 : null
      }
    }
  }

  const storage: AuthenticationStorage = {
    get () {
      if (process.client) {
        if (config.auth.mode === 'cookie') {
          return {
            access_token: memory.value?.access_token,
            expires: memory.value?.expires,
            expires_at: memory.value?.expires_at,
            refresh_token: null
          }
        } else if (config.auth.mode === 'session') {
          return {
            access_token: null,
            expires: getLocalStorageNumber('directus_expires'),
            expires_at: getLocalStorageNumber('directus_expires_at'),
            refresh_token: null
          }
        }
      }
      return {
        access_token: state.value?.access_token,
        expires: state.value?.expires,
        expires_at: state.value?.expires_at,
        refresh_token: null
      }
    },
    set (data) {
      if (process.client) {
        if (config.auth.mode === 'cookie') {
          memory.value = {
            access_token: data?.access_token,
            expires: data?.expires,
            expires_at: data?.expires_at
          }
        } else if (config.auth.mode === 'session') {
          setLocalStorageNumber('directus_expires', data?.expires)
          setLocalStorageNumber('directus_expires_at', data?.expires_at)
        }
      } else {
        state.value = {
          access_token: data?.access_token,
          expires: data?.expires,
          expires_at: data?.expires_at
        }
      }
    }
  }

  return storage
}
