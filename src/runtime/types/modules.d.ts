import type { RestClient } from "@directus/sdk";

declare module "#app" {
  interface NuxtApp {
    $directus: {
      rest: RestClient<DirectusSchema>;
    };
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $directus: {
      rest: RestClient<DirectusSchema>;
    };
  }
}

declare global {
  interface DirectusSchema {}
}

export {};
