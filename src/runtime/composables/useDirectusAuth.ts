import type { Ref } from "vue";
import { UserItem, ItemInput, TransportError, AuthResult } from "@directus/sdk";
import {
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useState,
  AsyncData,
  useAsyncData,
} from "#app";
import useDirectus from "./useDirectus";

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

type FetchReturnT<T> = Promise<AsyncData<T | null, TransportError | null>>;

type UserT = ItemInput<UserItem>;

export default function () {
  const publicConfig = useRuntimeConfig().public.directus;

  const useUser: () => Ref<(UserT & MyDirectusTypes["directus_users"]) | null> = () =>
    useState<(UserT & MyDirectusTypes["directus_users"]) | null>(
      "nuxt_directus_auth_user",
      () => null);

  const route = useRoute();

  const directus = useDirectus();

  async function login(credentials: {
    email: string;
    password: string;
    otp?: string;
  }): FetchReturnT<AuthResult> {
    return useAsyncData(() =>
      directus.auth
        .login(credentials)
        .then(async (res) => {
          await fetchUser();
          await navigateTo(publicConfig.auth.redirect.home);
          return res;
        })
    );
  }

  function loginWithProvider(provider: AuthProvider) {
    const redirectUrl = getRedirectUrl(publicConfig.auth.redirect.callback);

    if (process.client) {
      window.location.replace(
        `${publicConfig.baseUrl}/auth/login/${provider}?redirect=${redirectUrl}`
      );
    }
  }

  async function fetchUser(): FetchReturnT<UserT> {
    const user = useUser();
    return useAsyncData(() =>
      directus.users.me.read({fields:publicConfig.auth.userFields}).then((res) => (user.value = res))
    );
  }

  async function logout(): FetchReturnT<void> {
    const user = useUser();
    return useAsyncData(() =>
      directus.auth.logout().then(async () => {
        user.value = null;
        await navigateTo(publicConfig.auth.redirect.logout);
      })
    );
  }

  async function register(input: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }): FetchReturnT<any> {
    return useAsyncData(() =>
      directus.transport.post("/users", {
        email: input.email,
        password: input.password,
        first_name: input.first_name,
        last_name: input.last_name,
        role: publicConfig.auth.defaultRoleId,
      })
    );
  }

  function getRedirectUrl(path: string) {
    return publicConfig.nuxtBaseUrl + path;
  }

  /**
   * Don't forget to set PASSWORD_RESET_URL_ALLOW_LIST directus env
   */
  async function requestPasswordReset(email: string): FetchReturnT<any> {
    return useAsyncData(() =>
      directus.transport.post("/auth/password/request", {
        email: email,
        reset_url: getRedirectUrl(publicConfig.auth.redirect.resetPassword),
      })
    );
  }

  async function resetPassword(password: string): FetchReturnT<any> {
    return useAsyncData(() =>
      directus.transport.post("/auth/password/reset", {
        password: password,
        token: route.query.token,
      })
    );
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
