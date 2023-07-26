import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useDirectusAuth,
} from "#imports";
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

    const initialized = useState("nuxt_directus_initialized", () => false);

    if (initialized.value) {
      return;
    }

    initialized.value = true;

    const { fetchUser, storage } = useDirectusAuth();

    const { refresh_token } = storage.get();

    if (refresh_token || process.client) {
      await fetchUser();
    }
  } catch (error) {
    console.error(error);
  }
});
