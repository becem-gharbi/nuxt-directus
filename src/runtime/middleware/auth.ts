import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useDirectusAuth from "../composables/useDirectusAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const publicConfig = useRuntimeConfig().public.directus;

  if (
    to.path === publicConfig.auth.redirect.login ||
    to.path === publicConfig.auth.redirect.callback
  ) {
    return;
  }

  if (publicConfig.auth.enableGlobalAuthMiddleware === true) {
    if (to.meta.auth === false) {
      return;
    }
  }

  const { useUser } = useDirectusAuth();
  const user = useUser();

  if (!user.value) {
    return navigateTo({
      path: publicConfig.auth.redirect.login,
      query: { redirect: from.path },
    });
  }
});
