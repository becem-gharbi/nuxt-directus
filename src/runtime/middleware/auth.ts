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

  if (config.enableGlobalAuthMiddleware === true) {
    if (to.meta.auth === false) {
      return;
    }
  }

  const { loggedIn } = useDirectusAuth();

  if (!loggedIn.value) {
    return navigateTo({
      path: config.redirect.login,
      query: { redirect: to.path },
    });
  }
});
