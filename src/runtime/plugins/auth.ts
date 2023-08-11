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

    const initialized = useState("directus-initialized", () => false);

    if (initialized.value) {
      return;
    }

    initialized.value = true;

    const { fetchUser, storage, refresh } = useDirectusAuth();
    const { refresh_token, access_token, logged_in } = storage.get();

    if (access_token) {
      storage.set({ access_token, logged_in: "yes" });
      await fetchUser();
    } else {
      const { path } = useRoute();
      const isCallback = path === config.auth.redirect.callback;
      const isLoggedIn = logged_in === "yes";

      if (isCallback || isLoggedIn || refresh_token) {
        await refresh();

        const { access_token } = storage.get();
        if (access_token) {
          await fetchUser();
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});
