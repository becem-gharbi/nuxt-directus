export const getLocalStorageNumber = (key: string) => {
  if (import.meta.client) {
    return Number.parseInt(localStorage.getItem(key) ?? '') || null
  }
  return null
}

export const setLocalStorageNumber = (key: string, value: number | null | undefined) => {
  if (import.meta.client) {
    const isNumber = typeof value === 'number'
    if (isNumber) localStorage.setItem(key, value.toString())
    else localStorage.removeItem(key)
  }
}
