import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useDirectusSession,
} from "#imports";

export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig().public.directus;

  if (
    to.path === config.auth.redirect.login ||
    to.path === config.auth.redirect.callback
  ) {
    return;
  }

  const { accessToken } = useDirectusSession();

  if (accessToken.get()) {
    return navigateTo(config.auth.redirect.home);
  }
});
