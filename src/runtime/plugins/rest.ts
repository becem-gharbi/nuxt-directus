import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { createDirectus } from "@directus/sdk";
import { rest } from "@directus/sdk";
import { useDirectusAuth } from "#imports";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.directus;

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl);

  const restClient = directus.with(
    rest({
      onRequest: async (request) => {
        if (config.auth.enabled) {
          const { getToken } = useDirectusAuth();

          const accessToken = await getToken();

          if (accessToken) {
            request.headers = {
              ...request.headers,
              authorization: `Bearer ${accessToken}`,
            };
          }
        }

        return request;
      },
    })
  );

  return {
    provide: {
      directus: {
        rest: restClient,
      },
    },
  };
});
