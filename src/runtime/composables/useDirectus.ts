import { useNuxtApp } from "#app";
import type { Directus, Auth } from "@directus/sdk";

export default function () {
  const directus: Directus<MyDirectusTypes, Auth> = useNuxtApp().$directus;
  return directus;
}
