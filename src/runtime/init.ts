import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
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
