import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useDirectusAuth,
} from "#imports";

export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig().public.directus.auth;

  if (
    to.path === config.redirect.login ||
    to.path === config.redirect.callback
  ) {
    const { loggedIn } = useDirectusAuth();

    if (loggedIn.value) {
      const returnToPath = from.query.redirect?.toString();
      const redirectTo = returnToPath || config.redirect.home;
      return navigateTo(redirectTo);
    }
  }
});
