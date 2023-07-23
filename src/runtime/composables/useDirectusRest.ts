import { rest } from "@directus/sdk";
import { useCookie, useDirectus } from "#imports";
import type { DirectusClient, RestClient } from "@directus/sdk";

export default function useDirectusRest() {
  const accessToken = useCookie("directus_access_token");

  const client = useDirectus().with(
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
  ) as DirectusClient<MyDirectusTypes> & RestClient<MyDirectusTypes>;

  return client;
}
