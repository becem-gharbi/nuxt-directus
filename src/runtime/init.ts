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

    const useInitialized: () => Ref<boolean> = () =>
      useState<boolean>("nuxt_directus_initialized", () => false);

    const initialized = useInitialized();

    if (initialized.value) {
      return;
    }

    initialized.value = true;

    const refreshToken = useCookie("directus_refresh_token");

    if (refreshToken.value || process.client) {
      const { fetchUser } = useDirectusAuth();

      await fetchUser();
    }
  } catch (error) {
    console.error(error);
  }
});
