import type { RestCommand } from '@directus/sdk'
import { useNuxtApp } from '#imports'

export default async function useDirectusRest<Output extends object> (
  options: RestCommand<Output, DirectusSchema>
):Promise<Output> {
  const { $directus } = useNuxtApp()

  return await $directus.rest.request<Output>(options)
}
