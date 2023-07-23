import type { Ref } from "vue";
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
} from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";
import common from "./middleware/common";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(async () => {
  try {
    const config = useRuntimeConfig().public.directus;

    addRouteMiddleware("common", common, { global: true });

    addRouteMiddleware("auth", auth, {
      global: config.auth.enableGlobalAuthMiddleware,
    });

    addRouteMiddleware("guest", guest);
  } catch (error) {
    console.error(error);
  }
});
