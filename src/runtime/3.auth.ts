import { defineNuxtPlugin, useRuntimeConfig, useNuxtApp } from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const publicConfig = useRuntimeConfig().public.directus;
  const { useAccessToken, useInitialized, useUser, fetchUser } =
    useDirectusAuth();
  const accessToken = useAccessToken();
  const initialized = useInitialized();
  const user = useUser();

  const { $directus } = useNuxtApp();

  // if (!initialized.value) {
  //   initialized.value = true;

  //   const { refresh, fetchUser } = useDirectusAuth();

  //   await refresh();

  //   if (accessToken.value) {
  //     await fetchUser();
  //   }
  // }

  try {
    //await $directus.auth.refresh();
    if (user.value) return;
    await fetchUser();

    // await fetchUser();
    // let refreshToken = $directus.storage.auth_refresh_token;
    // console.log("before refresh", { refreshToken });
    //  await $directus.auth.refreshIfExpired();
    //
    // refreshToken = $directus.storage.auth_refresh_token;
    //  console.log("after refresh", { refreshToken });
    // const token = await directus.auth.token;
    // if (token) {
    //   user.value = await directus.users.me.read();
    // }
  } catch (error) {
    console.log(error);
  }
});
