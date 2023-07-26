import { rest } from "@directus/sdk";
import { useCookie, useDirectus } from "#imports";
import type { RestCommand } from "@directus/sdk";

export default function useDirectusRest(
  options: RestCommand<object, MyDirectusTypes>
): Promise<object> {
  const accessToken = useCookie("directus_access_token");

  return useDirectus()
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
