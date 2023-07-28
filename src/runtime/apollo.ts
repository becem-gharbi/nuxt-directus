import { defineNuxtPlugin, useDirectusAuth } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("apollo:auth", async ({ token }) => {
    const { storage, refresh } = useDirectusAuth();

    const { access_token, refresh_token } = storage.get();

    if (!access_token && (refresh_token || process.client)) {
      await refresh();
    }

    const { access_token: refreshedAccessToken } = storage.get();

    token.value = refreshedAccessToken || null;
  });
});
