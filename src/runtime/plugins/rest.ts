import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useDirectusStorage,
} from "#imports";
import { createDirectus, rest } from "@directus/sdk";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.directus;

  const directus = createDirectus<DirectusSchema>(config.rest.baseUrl);

  const restClient = directus.with(
    rest({
      onRequest: async (request) => {
        if (config.auth.enabled) {
          const { getToken } = useDirectusStorage();

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
