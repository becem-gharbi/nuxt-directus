import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";

export default defineNuxtPlugin(async () => {
  try {
    const useInitialized = () =>
      useState("directus_auth_initialized", () => false);

    const initialized = useInitialized();

    if (initialized.value) {
      return;
    }

    initialized.value = true;

    const { $directus } = useNuxtApp();
    const { fetchUser } = useDirectusAuth();
    const publicConfig = useRuntimeConfig().public.directus;
    const refreshToken = $directus.storage.get(
      publicConfig.auth.refreshTokenCookieName
    );

    if (refreshToken || process.client) {
      await fetchUser();
    }
  } catch (error) {
    console.error(error);
  }
});
