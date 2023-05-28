import type { Ref } from "vue";
import { UserItem, ItemInput, TransportError, AuthResult } from "@directus/sdk";
import {
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useState,
  AsyncData,
  useAsyncData,
  clearNuxtData,
} from "#app";
import useDirectus from "./useDirectus";
import { withQuery, joinURL } from "ufo";

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

  const useUser: () => Ref<
    (UserT & MyDirectusTypes["directus_users"]) | null
  > = () =>
    useState<(UserT & MyDirectusTypes["directus_users"]) | null>(
      "nuxt_directus_auth_user",
      () => null
    );

  const directus = useDirectus();

  async function login(credentials: {
    email: string;
    password: string;
    otp?: string;
    redirect?: string;
  }): FetchReturnT<AuthResult> {
    const route = useRoute();

    // The path of the protected route the user has entered
    const returnToPath = route.query.redirect?.toString();

    // The path to redirect to on login success
    const redirectTo =
      credentials.redirect || returnToPath || publicConfig.auth.redirect.home;

    return useAsyncData(() =>
      directus.auth.login(credentials).then(async (res) => {
        await fetchUser();
        await navigateTo(redirectTo);
        return res;
      })
    );
  }

  function loginWithProvider(arg: {
    provider: AuthProvider;
    redirect?: string;
  }) {
    const route = useRoute();

    // The path of the protected route the user has entered
    const returnToPath = route.query.redirect?.toString();

    const redirectTo = arg.redirect || returnToPath;

    let redirectUrl = getRedirectUrl(publicConfig.auth.redirect.callback);

    if (redirectTo) {
      redirectUrl = withQuery(redirectUrl, { redirect: redirectTo });
    }

    if (process.client) {
      const url = withQuery(
        joinURL(publicConfig.baseUrl, "/auth/login", arg.provider),
        { redirect: redirectUrl }
      );

      window.location.replace(url);
    }
  }

  async function fetchUser(): FetchReturnT<UserT> {
    const user = useUser();
    return useAsyncData(() =>
      directus.users.me
        .read({ fields: publicConfig.auth.userFields })
        .then((res) => (user.value = res))
    );
  }

  async function logout(): FetchReturnT<void> {
    const user = useUser();
    return useAsyncData(() =>
      directus.auth.logout().then(async () => {
        user.value = null;

        clearNuxtData();

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
    return joinURL(publicConfig.nuxtBaseUrl, path);
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
    const route = useRoute();

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
