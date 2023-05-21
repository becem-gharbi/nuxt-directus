import { defineNuxtRouteMiddleware, useRuntimeConfig, navigateTo } from "#app";
import useDirectusAuth from "../composables/useDirectusAuth";

export default defineNuxtRouteMiddleware((to, from) => {
  const publicConfig = useRuntimeConfig().public.directus;

  if (
    to.path === publicConfig.auth.redirect.login ||
    to.path === publicConfig.auth.redirect.callback
  ) {
    const { useUser } = useDirectusAuth();
    const user = useUser();

    if (user.value) {
      // The path of the protected route the user has entered
      const returnToPath = from.query.redirect?.toString();

      // The path to redirect to on login success
      const redirectTo = returnToPath || publicConfig.auth.redirect.home;

      return navigateTo(redirectTo);
    }
  }
});
