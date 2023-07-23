import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useDirectusAuth from "../composables/useDirectusAuth";

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig().public.directus.auth;

  if (
    to.path === config.redirect.login ||
    to.path === config.redirect.callback
  ) {
    return;
  }

  const { loggedIn } = useDirectusAuth();

  if (loggedIn.value) {
    return navigateTo(config.redirect.home);
  }
});
