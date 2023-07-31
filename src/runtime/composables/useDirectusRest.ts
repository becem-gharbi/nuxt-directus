import { useNuxtApp } from "#imports";
import type { RestCommand } from "@directus/sdk";

export default async function useDirectusRest(
  options: RestCommand<object, DirectusSchema>
): Promise<object> {
  const { $directus } = useNuxtApp();

  return $directus.rest.request(options);
}
