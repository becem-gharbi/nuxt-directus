import type { Ref } from "vue";
import { UserItem, ItemInput } from "@directus/sdk";

import type {
  ResponseLogin,
  AuthProvider,
  ResponseRefresh,
  User,
  UseDirectusFetchReturn,
} from "../types";

import {
  useRuntimeConfig,
  useRoute,
  navigateTo,
  useState,
  useRequestEvent,
  useRequestHeaders,
} from "#app";

export default function () {
  const publicConfig = useRuntimeConfig().public.directus;
  const useInitialized: () => Ref<boolean> = () =>
    useState("directus_auth_initialized", () => false);
  const useUser: () => Ref<ItemInput<UserItem> | null> = () =>
    useState<ItemInput<UserItem> | null>("directus_auth_user", () => null);
  const useAccessToken: () => Ref<string | null> = () =>
    useState<string | null>("directus_auth_access_token", () => null);
 // const event = useRequestEvent();
  const route = useRoute();

  const { $directus } = useNuxtApp();

  async function login(credentials: { email: string; password: string }) {
    const accessToken = useAccessToken();
    const user = useUser();
    return $directus.auth
      .login({
        email: credentials.email,
        password: credentials.password,
      })
      .then(async (res) => {
        // accessToken.value = res.access_token;
        await fetchUser();
        await navigateTo(publicConfig.auth.redirect.home);
      });
  }
  // async function login(credentials: {
  //   email: string;
  //   password: string;
  // }): UseDirectusFetchReturn<ResponseLogin> {
  //   const accessToken = useAccessToken();
  //   return useDirectusFetch<ResponseLogin>("/auth/login", {
  //     method: "POST",
  //     credentials: "include",
  //     body: {
  //       email: credentials.email,
  //       password: credentials.password,
  //       mode: "cookie",
  //     },
  //   }).then(async (res) => {
  //     if (res.data.value) {
  //       accessToken.value = res.data.value.data.access_token;
  //       await fetchUser();
  //       await navigateTo(publicConfig.auth.redirect.home);
  //     }
  //     return res;
  //   });
  // }

  async function loginWithProvider(provider: AuthProvider) {
    const redirectUrl = getRedirectUrl(publicConfig.auth.redirect.callback);

    if (process.client) {
      window.location.replace(
        `${publicConfig.baseUrl}/auth/login/${provider}?redirect=${redirectUrl}`
      );
    }
  }

  async function refresh() {
    // let cookie: string | undefined;
    // const accessToken = useAccessToken();
    // try {
    //   if (process.server) {
    //     const headers = useRequestHeaders(["Cookie"]);
    //     cookie = headers.cookie;
    //     if (
    //       !cookie ||
    //       !cookie.includes(publicConfig.auth.refreshTokenCookieName)
    //     ) {
    //       accessToken.value = null;
    //       return;
    //     }
    //   }
    //   const res = await $fetch.raw<ResponseRefresh>("/auth/refresh", {
    //     baseURL: publicConfig.baseUrl,
    //     method: "POST",
    //     credentials: "include",
    //     headers: cookie ? { cookie } : {},
    //   });
    //   if (process.server) {
    //     const cookie = res.headers.get("set-cookie") || "";
    //     appendHeader(event, "set-cookie", cookie);
    //   }
    //   accessToken.value = res._data?.data.access_token || null;
    // } catch (error) {
    //   accessToken.value = null;
    // }
  }

  async function fetchUser() {
    const user = useUser();

    // if (token && isTokenExpired(token)) {
    //   await $directus.auth.refresh();
    // }

    user.value = await $directus.users.me.read();
    // const accessToken = useAccessToken();
    // const user = useUser();

    // if (!accessToken.value) {
    //   user.value = null;
    //   return;
    // }

    // if (isAccessTokenExpired()) {
    //   await refresh();
    //   if (!accessToken.value) {
    //     await logout();
    //     return;
    //   }
    // }

    // try {
    //   const res = await $fetch<{ data: User }>("/users/me", {
    //     baseURL: publicConfig.baseUrl,
    //     headers: {
    //       Authorization: "Bearer " + accessToken.value,
    //     },
    //   });

    //   user.value = res.data;
    // } catch (error) {
    //   user.value = null;
    // }
  }

  async function logout() {
    const accessToken = useAccessToken();
    const user = useUser();
    return $directus.auth.logout().then(async () => {
      user.value = null;
      accessToken.value = null;
      await navigateTo(publicConfig.auth.redirect.logout);
    });
  }
  // async function logout() {
  //   const accessToken = useAccessToken();
  //   const user = useUser();

  //   if (accessToken.value) {
  //     await $fetch("/auth/logout", {
  //       baseURL: publicConfig.baseUrl,
  //       method: "POST",
  //       credentials: "include",
  //     });

  //     accessToken.value = null;
  //   }

  //   user.value = null;
  //   await navigateTo(publicConfig.auth.redirect.logout);
  // }

  function register(user: User): UseDirectusFetchReturn<User> {
    user.role = publicConfig.auth.defaultRoleId;

    return useDirectusFetch<User>("/users", {
      method: "POST",
      body: user,
    });
  }

  function getRedirectUrl(path: string) {
    return publicConfig.nuxtBaseUrl + path;
  }

  async function requestPasswordReset(
    email: string
  ): UseDirectusFetchReturn<void> {
    return useDirectusFetch<void>("/auth/password/request", {
      method: "POST",
      body: {
        email,
        reset_url: getRedirectUrl(publicConfig.auth.redirect.resetPassword),
      },
    });
  }

  async function resetPassword(password: string): UseDirectusFetchReturn<void> {
    return useDirectusFetch<void>("/auth/password/reset", {
      method: "POST",
      body: {
        password,
        token: route.query.token,
      },
    });
  }

  return {
    useInitialized,
    useUser,
    useAccessToken,
    login,
    loginWithProvider,
    refresh,
    fetchUser,
    logout,
    register,
    requestPasswordReset,
    resetPassword,
    //isAccessTokenExpired,
  };
}
