import { useNuxtApp } from "#app";
import type { DirectusClient } from "../types";

export default function () {
  const directus: DirectusClient<MyDirectusTypes> = useNuxtApp().$directus;

  return directus;
}
