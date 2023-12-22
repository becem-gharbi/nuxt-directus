import type { TokenStore } from '../types'

export const memoryStorage = (scope: string) => {
  const store: Record<string, TokenStore | null> = {}

  return {
    get value () {
      return store[scope] ?? null
    },
    set value (data: TokenStore | null) {
      if (process.client) { store[scope] = data }
    }
  }
}
