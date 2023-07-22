import { authentication } from "@directus/sdk";
import { useRuntimeConfig } from "#app";
import useDirectus from "./useDirectus";
import type { Authentication } from "../types/config";

export default function useDirectusAuth() {
  const config = useRuntimeConfig().public.directus.auth as Authentication;

  const client = useDirectus().with(
    authentication(config.mode, {
      autoRefresh: config.autoRefresh,
      msRefreshBeforeExpires: config.msRefreshBeforeExpires,
      storage: config.storage,
    })
  );

  return client;
}
