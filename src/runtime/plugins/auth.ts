import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useDirectusAuth,
  useRoute,
  useDirectusStorage,
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

    const initialized = useState("directus-auth-initialized", () => false);

    if (initialized.value) {
      return;
    }

    initialized.value = true;

    const { path } = useRoute();
    const { fetchUser } = useDirectusAuth();
    const { refreshToken, accessToken, loggedIn, refresh } =
      useDirectusStorage();

    if (accessToken.get()) {
      loggedIn.set(true);
      await fetchUser();
    } else {
      const isCallback = path === config.auth.redirect.callback;
      const isLoggedIn = loggedIn.get() === "true";

      if (isCallback || isLoggedIn || refreshToken.get()) {
        await refresh();
        if (accessToken.get()) {
          await fetchUser();
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
});
