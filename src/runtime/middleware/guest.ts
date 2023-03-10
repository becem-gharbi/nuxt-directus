import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useDirectusAuth from "../composables/useDirectusAuth";

export default defineNuxtRouteMiddleware((to) => {
  const publicConfig = useRuntimeConfig().public.directus;

  if (
    to.path === publicConfig.auth.redirect.login ||
    to.path === publicConfig.auth.redirect.callback
  ) {
    return;
  }

  const { useUser } = useDirectusAuth();
  const user = useUser();

  if (user.value) {
    return navigateTo(publicConfig.auth.redirect.home);
  }
});
