import { rest } from "@directus/sdk";
import { useRuntimeConfig } from "#app";
import useDirectus from "./useDirectus";
import type { Rest } from "../types/config";

export default function useDirectusRest() {
  const config = useRuntimeConfig().public.directus.rest as Rest;

  const client = useDirectus().with(rest(config));

  return client;
}
