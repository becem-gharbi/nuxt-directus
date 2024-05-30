import type { RestCommand } from '@directus/sdk'
import { useNuxtApp } from '#imports'

export async function useDirectusRest<Output extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: RestCommand<Output, keyof DirectusSchema extends never ? any : DirectusSchema>,
): Promise<Output> {
  return await useNuxtApp().$directus.client.request<Output>(options)
}
