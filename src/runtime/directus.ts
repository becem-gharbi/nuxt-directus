import { defineNuxtPlugin, useRuntimeConfig } from "#imports";
import { createDirectus } from "@directus/sdk";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.directus;

  const directus = createDirectus<MyDirectusTypes>(config.baseUrl);

  return {
    provide: {
      directus,
    },
  };
});
