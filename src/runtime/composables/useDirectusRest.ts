import { rest } from "@directus/sdk";
import { useCookie, useNuxtApp } from "#imports";
import type { RestCommand } from "@directus/sdk";

export default function useDirectusRest(
  options: RestCommand<object, MyDirectusTypes>
): Promise<object> {
  const accessToken = useCookie("directus_access_token");

  const { $directus } = useNuxtApp();

  return $directus
    .with(
      rest({
        onRequest(request) {
          if (accessToken.value) {
            request.headers = {
              ...request.headers,
              authorization: `Bearer ${accessToken.value}`,
            };
          }

          return request;
        },
      })
    )
    .request(options);
}
