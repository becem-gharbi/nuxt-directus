import type { RestCommand } from '@directus/sdk'
import { useNuxtApp } from '#imports'

export default async function useDirectusRest (
  options: RestCommand<object, DirectusSchema>
): Promise<object> {
  const { $directus } = useNuxtApp()

  return await $directus.rest.request(options)
}
