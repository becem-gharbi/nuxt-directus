import { readMe } from "@directus/sdk";
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
import type { Ref } from "#imports";
import type { AuthenticationData, DirectusUser } from "@directus/sdk";
import type { AuthStorage, AuthStorageData, PublicConfig } from "../types";

export default function useDirectusAuth() {
  const event = useRequestEvent();

  const user: Ref<DirectusUser<never> | null> = useState(
    "directus-user",
    () => null
  );

  const config = useRuntimeConfig().public.directus as PublicConfig;

  const storage: AuthStorage = {
    get() {
      return {
        access_token: process.server
          ? event?.context?.access_token
          : useCookie(config.auth.accessTokenCookieName).value,
        refresh_token: process.server
          ? getCookie(event, config.auth.refreshTokenCookieName)
          : undefined,
      };
    },

    set(data) {
      const maxAge = data?.expires
        ? (data.expires - config.auth.msRefreshBeforeExpires) / 1000
        : undefined;

      if (process.server) {
        event.context.access_token = data.access_token || "";
        setCookie(
          event,
          config.auth.accessTokenCookieName,
          event.context.access_token,
          {
            sameSite: "lax",
            secure: true,
            maxAge,
          }
        );
      } else {
        useCookie(config.auth.accessTokenCookieName, {
          sameSite: "lax",
          secure: true,
          maxAge,
        }).value = data.access_token;
      }
    },

    clear() {
      this.set({
        access_token: null,
        expires: null,
      });
    },
  };

  async function login(email: string, password: string) {
    const { data } = await $fetch<{ data: AuthenticationData }>("/auth/login", {
      baseURL: config.rest.baseUrl,
      method: "POST",
      credentials: "include",
      body: {
        mode: "cookie",
        email,
        password,
      },
    });

    const route = useRoute();

    const returnToPath = route.query.redirect?.toString();
    const redirectTo = returnToPath || config.auth.redirect.home;

    storage.set(data);

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
    //@ts-ignore
    user.value = await useDirectusRest(readMe());
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
      .then(({ data }) => storage.set(data))
      .catch(async () => {
        storage.clear();
        return navigateTo(config.auth.redirect.logout);
      });
  }

  async function loginWithProvider(provider: string) {
    const route = useRoute();

    const returnToPath = route.query.redirect?.toString();

    let redirectUrl = joinURL(
      config.rest.nuxtBaseUrl,
      config.auth.redirect.callback
    );

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

  /**
   *
   * @returns fresh access token (refreshed if expired)
   */
  async function getToken(): Promise<AuthStorageData["access_token"]> {
    const { access_token, refresh_token } = storage.get();

    if (!access_token && (refresh_token || process.client)) {
      await refresh();
    }

    return storage.get().access_token;
  }

  return {
    login,
    logout,
    fetchUser,
    refresh,
    loginWithProvider,
    getToken,
    storage,
    user,
  };
}
