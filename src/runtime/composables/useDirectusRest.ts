import { rest } from "@directus/sdk";
import { useNuxtApp, useDirectusAuth } from "#imports";
import type { RestCommand } from "@directus/sdk";

export default async function useDirectusRest(
  options: RestCommand<object, DirectusSchema>
): Promise<object> {
  const { $directus } = useNuxtApp();

  const { getToken } = useDirectusAuth();

  const accessToken = await getToken();

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
