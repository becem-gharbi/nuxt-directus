import { rest } from "@directus/sdk";
import { useNuxtApp, useDirectusAuth } from "#imports";
import type { RestCommand } from "@directus/sdk";

export default async function useDirectusRest(
  options: RestCommand<object, DirectusSchema>
): Promise<object> {
  const { storage, refresh } = useDirectusAuth();

  const { access_token, refresh_token } = storage.get();

  if (!access_token && (refresh_token || process.client)) {
    await refresh();
  }

  const { $directus } = useNuxtApp();

  return $directus
    .with(
      rest({
        onRequest(request) {
          const { access_token } = storage.get();
          if (access_token) {
            request.headers = {
              ...request.headers,
              authorization: `Bearer ${access_token}`,
            };
          }

          return request;
        },
      })
    )
    .request(options);
}
