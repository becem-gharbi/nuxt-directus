import type { DirectusClient } from "@directus/sdk";

declare module "#app" {
  interface NuxtApp {
    $directus: DirectusClient<CustomDirectusTypes>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $directus: DirectusClient<CustomDirectusTypes>;
  }
}

export {};
