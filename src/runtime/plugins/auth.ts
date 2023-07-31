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

    const { fetchUser, storage, refresh } = useDirectusAuth();

    const { refresh_token, access_token } = storage.get();

    const { path } = useRoute();

    if (path === config.auth.redirect.callback) {
      await refresh();
      await fetchUser();
    }

    if (refresh_token || access_token) {
      await fetchUser();
    }
  } catch (e) {
    console.log(e);
  }
});
