import { defineNuxtPlugin, useDirectusAuth } from "#imports";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook("apollo:auth", async ({ token }) => {
    const { getToken } = useDirectusAuth();

    const accessToken = await getToken();

    token.value = accessToken || null;
  });
});
