import { useNuxtApp, useRuntimeConfig } from "#imports";
import { realtime } from "@directus/sdk";
import type { PublicConfig } from "../types";

export default function useDirectusRealtime() {
  const { $directus } = useNuxtApp();

  const config = useRuntimeConfig().public.directus as PublicConfig;

  const client = $directus.with(realtime(config.realtime));

  return client;
}
