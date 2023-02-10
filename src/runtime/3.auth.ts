import { defineNuxtPlugin, useNuxtApp } from "#app";
import useDirectusAuth from "./composables/useDirectusAuth";

export default defineNuxtPlugin(async () => {
  try {
    const { useUser, fetchUser } = useDirectusAuth();
    const user = useUser();

    const { $directus } = useNuxtApp();
  //  if (user.value || !$directus.storage.auth_token) return;
    await fetchUser();
  } catch (error) {
    console.error(error);
  }
});
