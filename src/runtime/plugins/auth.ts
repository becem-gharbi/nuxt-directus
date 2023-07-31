import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useDirectusAuth,
  useRoute,
} from "#imports";
import common from "../middleware/common";
import auth from "../middleware/auth";
import guest from "../middleware/guest";

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

    const { refresh_token, access_token, max_age } = storage.get();

    const { path } = useRoute();

    if (
      refresh_token ||
      access_token ||
      path === config.auth.redirect.callback
    ) {
      await fetchUser();
    }
  } catch (e) {
    console.log(e);
  }
});
