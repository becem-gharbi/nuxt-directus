import type { TokenStore } from '../types'
import { memoryStorage } from '../utils/memory-storage'
import { useState, useRuntimeConfig } from '#imports'

export function useDirectusToken () {
  const config = useRuntimeConfig().public.directus.auth
  const tokenCookieName = config.accessTokenCookieName
  const msRefreshBeforeExpires = config.msRefreshBeforeExpires
  const stateName = `directus-token-${tokenCookieName}`
  const state = useState<TokenStore | null>(stateName, () => null)
  const memory = memoryStorage(tokenCookieName)

  if (process.client && state.value) {
    memory.value = { ...state.value }
    state.value = null
  }

  return {
    get value () {
      if (process.client) {
        return memory.value
      }
      return state.value
    },

    set value (data: TokenStore | null) {
      if (process.client) {
        memory.value = data
      } else {
        state.value = data
      }
    },

    get expired () {
      if (this.value) {
        const expires = this.value.expires * 1000 - msRefreshBeforeExpires
        return expires < Date.now()
      }
      return false
    }
  }
}
