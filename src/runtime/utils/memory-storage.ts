import type { TokenStore } from '../types'

export const memoryStorage = () => {
  let store: TokenStore | null = null

  return {
    get value () {
      return store
    },
    set value (data: TokenStore | null) {
      if (process.client) { store = data }
    }
  }
}
