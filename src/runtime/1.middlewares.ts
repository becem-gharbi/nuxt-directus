import { defineNuxtPlugin, addRouteMiddleware, useRuntimeConfig } from "#app";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(() => {
  const publicConfig = useRuntimeConfig().public.directus;
  
  addRouteMiddleware(common);

  addRouteMiddleware("auth", auth, {
    global: publicConfig.auth.enableGlobalAuthMiddleware,
  });

  addRouteMiddleware("guest", guest);
});
