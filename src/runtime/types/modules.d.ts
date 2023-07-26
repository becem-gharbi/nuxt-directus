import type { DirectusClient } from "@directus/sdk";

declare module "#app" {
  interface NuxtApp {
    $directus: DirectusClient<DirectusSchema>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $directus: DirectusClient<DirectusSchema>;
  }
}

declare global {
  interface DirectusSchema {}
}

export {};
