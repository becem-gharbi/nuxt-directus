import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useDirectusAuth,
} from "#imports";

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
