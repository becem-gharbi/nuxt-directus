import { useNuxtApp } from "#app";
import type { DirectusClient } from "@directus/sdk";

export default function () {
  const directus: DirectusClient<MyDirectusTypes> = useNuxtApp().$directus;

  return directus;
}
