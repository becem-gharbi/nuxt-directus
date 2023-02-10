import type { Ref } from "vue";
import { UserItem, ItemInput } from "@directus/sdk";
import { useRuntimeConfig, useRoute, navigateTo, useState } from "#app";

type AuthProvider =
  | "google"
  | "facebook"
  | "twitter"
  | "microsoft"
  | "okta"
  | "auth0"
  | "keycloak"
  | "github"
  | "discord"
  | "twitch"
  | "apple";

export default function () {
  const publicConfig = useRuntimeConfig().public.directus;
  const useUser: () => Ref<ItemInput<UserItem> | null> = () =>
    useState<ItemInput<UserItem> | null>("directus_auth_user", () => null);
  const route = useRoute();

  const { $directus } = useNuxtApp();

  async function login(credentials: { email: string; password: string }) {
    return $directus.auth
      .login({
        email: credentials.email,
        password: credentials.password,
      })
      .then(async () => {
        await fetchUser();
        await navigateTo(publicConfig.auth.redirect.home);
      });
  }

  async function loginWithProvider(provider: AuthProvider) {
    const redirectUrl = getRedirectUrl(publicConfig.auth.redirect.callback);

    if (process.client) {
      window.location.replace(
        `${publicConfig.baseUrl}/auth/login/${provider}?redirect=${redirectUrl}`
      );
    }
  }

  async function fetchUser() {
    const user = useUser();
    user.value = await $directus.users.me.read();
  }

  async function logout() {
    const user = useUser();
    return $directus.auth.logout().then(async () => {
      user.value = null;
      await navigateTo(publicConfig.auth.redirect.logout);
    });
  }

  function register(input: { email: string; password: string }) {
    return $directus.transport.post("/users", {
      email: input.email,
      password: input.password,
      role: publicConfig.auth.defaultRoleId,
    });
  }

  function getRedirectUrl(path: string) {
    return publicConfig.nuxtBaseUrl + path;
  }

  async function requestPasswordReset(email: string) {
    return $directus.transport.post("/auth/password/request", {
      email: email,
      reset_url: getRedirectUrl(publicConfig.auth.redirect.resetPassword),
    });
  }

  async function resetPassword(password: string) {
    return $directus.transport.post("/auth/password/reset", {
      password: password,
      token: route.query.token,
    });
  }

  return {
    useUser,
    login,
    loginWithProvider,
    fetchUser,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
  };
}
