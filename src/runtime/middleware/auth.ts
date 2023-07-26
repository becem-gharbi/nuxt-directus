import {
  defineNuxtRouteMiddleware,
  useRuntimeConfig,
  navigateTo,
  useDirectusAuth,
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

  const { storage } = useDirectusAuth();
  const { access_token } = storage.get();

  if (!access_token) {
    return navigateTo({
      path: config.auth.redirect.login,
      query: { redirect: to.path },
    });
  }
});
