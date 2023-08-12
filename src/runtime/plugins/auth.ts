import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
  useDirectusAuth,
  useRoute,
  useDirectusSession,
  useNuxtApp,
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

    if (initialized.value === false) {
      const { path } = useRoute();

      const { fetchUser } = useDirectusAuth();
      const { refreshToken, accessToken, loggedIn, refresh } =
        useDirectusSession();

      if (accessToken.get()) {
        await fetchUser();
        loggedIn.set(true);
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
    }

    initialized.value = true;

    const { user } = useDirectusAuth();

    if (user.value) {
      const { callHook } = useNuxtApp();
      await callHook("directus:loggedIn", true);
    }
  } catch (e) {
    console.log(e);
  }
});
