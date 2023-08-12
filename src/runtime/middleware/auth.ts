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

  if (config.auth.enableGlobalAuthMiddleware === true) {
    if (to.meta.auth === false) {
      return;
    }
  }

  const { accessToken } = useDirectusSession();

  if (!accessToken.get()) {
    return navigateTo({
      path: config.auth.redirect.login,
      query: { redirect: to.path },
    });
  }
});
