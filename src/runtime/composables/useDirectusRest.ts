import { rest } from "@directus/sdk";
import { useCookie, useNuxtApp, useDirectusAuth } from "#imports";
import type { RestCommand } from "@directus/sdk";

export default function useDirectusRest(
  options: RestCommand<object, DirectusSchema>
): Promise<object> {
  const { storage } = useDirectusAuth();

  const accessToken = storage.get().access_token;

  const { $directus } = useNuxtApp();

  return $directus
    .with(
      rest({
        onRequest(request) {
          if (accessToken) {
            request.headers = {
              ...request.headers,
              authorization: `Bearer ${accessToken}`,
            };
          }

          return request;
        },
      })
    )
    .request(options);
}
