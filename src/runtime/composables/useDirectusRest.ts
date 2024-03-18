import type { RestCommand } from '@directus/sdk'
import { useNuxtApp } from '#imports'

export async function useDirectusRest<Output extends object> (
  options: RestCommand<Output, DirectusSchema>
): Promise<Output> {
  return await useNuxtApp().$directus.client.request<Output>(options)
}
