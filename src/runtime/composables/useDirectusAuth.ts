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
import type { AuthStorage } from "../types";

export default function useDirectusAuth() {
  const event = useRequestEvent();

  const storage: AuthStorage = {
    get() {
      return {
        access_token: process.server
          ? event?.context?.access_token
          : useCookie("directus_access_token").value,
        refresh_token: process.server
          ? getCookie(event, "directus_refresh_token")
          : undefined,
      };
    },

    set(data) {
      const maxAge = data?.expires ? data.expires / 1000 : undefined;
      const name = "directus_access_token";

      if (process.server) {
        event.context.access_token = data.access_token || "";
        setCookie(event, name, event.context.access_token, {
          sameSite: "lax",
          secure: true,
          maxAge,
        });
      } else {
        const cookie = useCookie(name, {
          sameSite: "lax",
          secure: true,
          maxAge,
        });
        cookie.value = data.access_token;
      }
    },

    clear() {
      this.set({
        access_token: null,
        expires: null,
      });
    },
  };

  const user: Ref<DirectusUser<never> | null> = useState(
    "directus-user",
    () => null
  );

  const config = useRuntimeConfig().public.directus;

  async function login(email: string, password: string) {
    const { data } = await $fetch<{ data: AuthenticationData }>("/auth/login", {
      baseURL: config.baseUrl,
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

    await fetchUser();
    return navigateTo(redirectTo);
  }

  async function logout() {
    await $fetch("/auth/logout", {
      baseURL: config.baseUrl,
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
      baseURL: config.baseUrl,
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
      .catch(() => storage.clear());
  }

  async function loginWithProvider(provider: string) {
    const route = useRoute();

    const returnToPath = route.query.redirect?.toString();

    let redirectUrl = joinURL(
      config.nuxtBaseUrl,
      config.auth.redirect.callback
    );

    if (returnToPath) {
      redirectUrl = withQuery(redirectUrl, { redirect: returnToPath });
    }

    if (process.client) {
      const url = withQuery(joinURL(config.baseUrl, "/auth/login", provider), {
        redirect: redirectUrl,
      });

      window.location.replace(url);
    }
  }

  return {
    login,
    logout,
    fetchUser,
    refresh,
    loginWithProvider,
    storage,
    user,
  };
}
