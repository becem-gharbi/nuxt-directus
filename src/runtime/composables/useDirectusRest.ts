import { rest } from "@directus/sdk";
import { useRuntimeConfig } from "#app";
import useDirectus from "./useDirectus";

export default function useDirectusRest() {
  const config = useRuntimeConfig().public.directus.rest;

  const client = useDirectus().with(rest(config));

  return client;
}
