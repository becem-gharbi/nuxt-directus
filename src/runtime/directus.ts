import { defineNuxtPlugin, useRuntimeConfig } from "#app";

import { createDirectus } from "@directus/sdk";

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig().public.directus;

  const directus = createDirectus<MyDirectusTypes>(config.baseUrl);

  return {
    provide: {
      directus,
    },
  };
});
