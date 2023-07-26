import { readMe } from "@directus/sdk";
import {
  useCookie,
  useState,
  useRuntimeConfig,
  useDirectusRest,
  useRoute,
  navigateTo,
  clearNuxtData,
} from "#imports";
import type { Ref } from "#imports";
import type { AuthenticationData, DirectusUser } from "@directus/sdk";
import type { AuthStorage } from "../types";

export default function useDirectusAuth() {
  const loggedIn: Ref<boolean> = useState("directus-logged-in", () =>
    useCookie("directus_access_token").value ? true : false
  );

  const user: Ref<DirectusUser<never> | null> = useState(
    "directus-user",
    () => null
  );

  const config = useRuntimeConfig().public.directus;

  const storage: AuthStorage = {
    get() {
      return {
        access_token: useCookie("directus_access_token").value || "",
        refresh_token: useCookie("directus_refresh_token").value || "",
      };
    },

    set(data) {
      const maxAge = data?.expires && data.expires / 1000;
      const options = maxAge ? { maxAge } : {};
      useCookie("directus_access_token", options).value = data?.access_token;
    },

    clear() {
      this.set({
        access_token: null,
        expires: null,
        refresh_token: null,
      });
    },
  };

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
    loggedIn.value = true;

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
    loggedIn.value = false;
    user.value = null;

    return navigateTo(config.auth.redirect.logout);
  }

  async function fetchUser() {
    //@ts-ignore
    user.value = await useDirectusRest(readMe());
  }

  async function refresh() {
    const { data } = await $fetch<{ data: AuthenticationData }>(
      "/auth/refresh",
      {
        baseURL: config.baseUrl,
        method: "POST",
        credentials: "include",
        body: {
          mode: "cookie",
        },
      }
    );

    storage.set(data);
  }

  return { login, logout, fetchUser, refresh, storage, loggedIn, user };
}
