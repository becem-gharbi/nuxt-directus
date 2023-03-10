import type { Ref } from "vue";
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
} from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";
import useDirectus from "./composables/useDirectus";
import common from "./middleware/common.global";
import auth from "./middleware/auth";
import guest from "./middleware/guest";

export default defineNuxtPlugin(async () => {
  try {
    const publicConfig = useRuntimeConfig().public.directus;

    addRouteMiddleware(common);

    addRouteMiddleware("auth", auth, {
      global: publicConfig.auth.enableGlobalAuthMiddleware,
    });

    addRouteMiddleware("guest", guest);

    if (!publicConfig.auth?.enabled) {
      return;
    }

    const useInitialized: () => Ref<boolean> = () =>
      useState<boolean>("nuxt_directus_initialized", () => false);

    const initialized = useInitialized();

    if (initialized.value) {
      return;
    }

    initialized.value = true;

    const directus = useDirectus();

    const { fetchUser } = useDirectusAuth();

    const refreshToken = directus.storage.get(
      publicConfig.auth.refreshTokenCookieName
    );

    if (refreshToken || process.client) {
      await fetchUser();
    }
  } catch (error) {
    console.error(error);
  }
});
