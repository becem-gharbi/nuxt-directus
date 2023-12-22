import type { TokenStore } from '../types'
import { memoryStorage } from '../utils/memory-storage'
import { useState, useRuntimeConfig } from '#imports'

const memory = memoryStorage()

export function useDirectusToken () {
  const config = useRuntimeConfig().public.directus
  const msRefreshBeforeExpires = config.auth.msRefreshBeforeExpires
  const state = useState<TokenStore | null>('directus-auth-token', () => null)

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
        const expires = this.value.expires - msRefreshBeforeExpires
        return expires < Date.now()
      }
      return false
    }
  }
}