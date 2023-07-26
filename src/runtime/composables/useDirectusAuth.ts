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
import type {
  AuthenticationStorage,
  AuthenticationData,
  DirectusUser,
} from "@directus/sdk";

export default function useDirectusAuth() {
  const loggedIn: Ref<boolean> = useState("directus-logged-in", () =>
    useCookie("directus_access_token").value ? true : false
  );

  const user: Ref<DirectusUser<never> | null> = useState(
    "directus-user",
    () => null
  );

  const config = useRuntimeConfig().public.directus;

  const storage: AuthenticationStorage = {
    get() {
      const data: AuthenticationData = {
        access_token: useCookie("directus_access_token").value || "",
        expires: parseInt(useCookie("directus_expires").value || ""),
        expires_at: parseInt(useCookie("directus_expires_at").value || ""),
        refresh_token: useCookie("directus_refresh_token").value || "",
      };

      return data;
    },

    set(data) {
      const maxAge = data?.expires && data.expires / 1000;
      const options = maxAge ? { maxAge } : {};

      useCookie("directus_access_token", options).value = data?.access_token;
      useCookie("directus_expires").value = data?.expires?.toString();
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

    await storage.set(data);

    await fetchUser();
    return navigateTo(redirectTo);
  }

  async function logout() {
    await $fetch("/auth/logout", {
      baseURL: config.baseUrl,
      method: "POST",
      credentials: "include",
    });

    storage.set({
      access_token: null,
      expires: null,
      expires_at: null,
      refresh_token: null,
    });

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

    await storage.set(data);
  }

  return { login, logout, fetchUser, refresh, loggedIn, user };
}
