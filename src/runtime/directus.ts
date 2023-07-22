import { defineNuxtPlugin, useRuntimeConfig } from "#app";

import { createDirectus } from "@directus/sdk";

export default defineNuxtPlugin(async () => {
  const publicConfig = useRuntimeConfig().public.directus;

  const directus = createDirectus<MyDirectusTypes>(publicConfig.baseUrl);

  return {
    provide: {
      directus,
    },
  };
});
