import type { Ref } from "vue";
import {
  defineNuxtPlugin,
  addRouteMiddleware,
  useRuntimeConfig,
  useState,
} from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";
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

    const { refresh } = useDirectusAuth();

    // const refreshToken = directus.storage.get(
    //   publicConfig.auth.refreshTokenCookieName
    // );

    // if (refreshToken || process.client) {
    //   await fetchUser();
    // }
  } catch (error) {
    console.error(error);
  }
});
