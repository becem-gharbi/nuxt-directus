export const getLocalStorageNumber = (key: string) => {
  if (process.client) {
    return parseInt(localStorage.getItem(key) ?? '') || null
  }
  return null
}

export const setLocalStorageNumber = (key: string, value: number | null | undefined) => {
  if (process.client) {
    const isNumber = typeof value === 'number'
    isNumber ? localStorage.setItem(key, value.toString()) : localStorage.removeItem(key)
  }
}
