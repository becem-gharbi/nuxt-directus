import { readMe, passwordRequest, passwordReset } from "@directus/sdk";
import {
  useCookie,
  useState,
  useRuntimeConfig,
  useDirectusRest,
  useRoute,
  navigateTo,
  clearNuxtData,
  useRequestEvent,
  useRequestHeaders,
} from "#imports";
import { joinURL, withQuery } from "ufo";
import { appendHeader, getCookie, setCookie } from "h3";
import jwtDecode from "jwt-decode";

import type { Ref } from "#imports";
import type { AuthenticationData, DirectusUser } from "@directus/sdk";
import type { AuthStorage, AuthStorageData, PublicConfig } from "../types";

export default function useDirectusAuth<DirectusSchema extends object>() {
  const event = useRequestEvent();

  const user: Ref<DirectusUser<DirectusSchema> | null> = useState(
    "directus-user",
    () => null
  );

  const config = useRuntimeConfig().public.directus as PublicConfig;

  const storage: AuthStorage = {
    get() {
      function _get(key: string) {
        if (process.server) {
          return event.context[key] || getCookie(event, key);
        }
        return useCookie(key).value;
      }
      return {
        access_token: _get(config.auth.accessTokenCookieName),
        refresh_token: _get(config.auth.refreshTokenCookieName),
      };
    },

    set(data) {
      function _set(key: string, value: string | undefined | null) {
        if (process.server) {
          event.context[key] = value;
          setCookie(event, key, value || "", {
            sameSite: "strict",
            secure: true,
            maxAge: config.auth.accessTokenCookieMaxAge,
          });
        } else {
          useCookie(key, {
            sameSite: "strict",
            secure: true,
            maxAge: config.auth.accessTokenCookieMaxAge,
          }).value = value;
        }
      }

      _set(config.auth.accessTokenCookieName, data.access_token);
    },

    clear() {
      this.set({
        access_token: null,
      });
    },
  };

  async function login(email: string, password: string, otp?: string) {
    const { data } = await $fetch<{ data: AuthenticationData }>("/auth/login", {
      baseURL: config.rest.baseUrl,
      method: "POST",
      credentials: "include",
      body: {
        mode: "cookie",
        email,
        password,
        otp,
      },
    });

    const route = useRoute();

    const returnToPath = route.query.redirect?.toString();
    const redirectTo = returnToPath || config.auth.redirect.home;

    storage.set({ access_token: data.access_token });

    // A workaround to insure access token cookie is set
    setTimeout(async () => {
      await fetchUser();
      return navigateTo(redirectTo);
    }, 100);
  }

  async function logout() {
    await $fetch("/auth/logout", {
      baseURL: config.rest.baseUrl,
      method: "POST",
      credentials: "include",
    });

    storage.clear();

    clearNuxtData();
    user.value = null;

    return navigateTo(config.auth.redirect.logout);
  }

  async function fetchUser() {
    const fields = config.auth.userFields || ["*"];

    //@ts-ignore
    user.value = await useDirectusRest(readMe({ fields }));
  }

  async function refresh() {
    const cookie = useRequestHeaders(["cookie"]).cookie || "";

    await $fetch<{ data: AuthenticationData }>("/auth/refresh", {
      baseURL: config.rest.baseUrl,
      method: "POST",
      credentials: "include",
      body: {
        mode: "cookie",
      },
      headers: {
        cookie,
      },
      onResponse: ({ response }) => {
        if (response.ok && process.server) {
          const cookie = response.headers.get("set-cookie") || "";
          appendHeader(event, "set-cookie", cookie);
        }
      },
    })
      .then(({ data }) => storage.set({ access_token: data.access_token }))
      .catch(async () => {
        storage.clear();
        return navigateTo(config.auth.redirect.logout);
      });
  }

  async function loginWithProvider(provider: string) {
    const route = useRoute();

    const returnToPath = route.query.redirect?.toString();

    let redirectUrl = getRedirectUrl(config.auth.redirect.callback);

    if (returnToPath) {
      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath });
    }

    if (process.client) {
      const url = withQuery(
        joinURL(config.rest.baseUrl, "/auth/login", provider),
        {
          redirect: redirectUrl,
        }
      );

      window.location.replace(url);
    }
  }

  async function getToken(): Promise<AuthStorageData["access_token"]> {
    const { access_token } = storage.get();

    if (access_token && isTokenExpired(access_token)) {
      await refresh();
    }

    return storage.get().access_token;
  }

  function requestPasswordReset(email: string) {
    const resetUrl = getRedirectUrl(config.auth.redirect.resetPassword);
    return useDirectusRest(passwordRequest(email, resetUrl));
  }

  function resetPassword(password: string) {
    const route = useRoute();
    const token = route.query.token as string;

    return useDirectusRest(passwordReset(token, password));
  }

  function getRedirectUrl(path: string) {
    return joinURL(config.rest.nuxtBaseUrl, path);
  }

  function isTokenExpired(token: string) {
    const decoded = jwtDecode(token) as { exp: number };
    const expires = decoded.exp * 1000 - config.auth.msRefreshBeforeExpires;
    return expires < Date.now();
  }

  return {
    login,
    logout,
    fetchUser,
    loginWithProvider,
    getToken,
    requestPasswordReset,
    resetPassword,
    refresh,
    storage,
    user,
  };
}
