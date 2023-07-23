import { authentication, readMe } from "@directus/sdk";
import {
  useCookie,
  useState,
  useRuntimeConfig,
  useDirectus,
  useDirectusRest,
  useRoute,
  navigateTo,
  clearNuxtData,
} from "#imports";
import type { Ref } from "#imports";
import type { LoginParams, Authentication } from "../types/index";
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

  const config = useRuntimeConfig().public.directus.auth as Authentication;

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
      useCookie("directus_expires_at").value = data?.expires_at?.toString();
      useCookie("directus_refresh_token").value = data?.refresh_token;
    },
  };

  const client = useDirectus().with(
    authentication("json", {
      autoRefresh: true,
      msRefreshBeforeExpires: 3000,
      storage,
    })
  );

  async function login(params: LoginParams) {
    const route = useRoute();

    return client.login(params.email, params.password).then(async () => {
      const returnToPath = route.query.redirect?.toString();
      const redirectTo = returnToPath || config.redirect.home;
      loggedIn.value = true;
      await fetchUser();
      return navigateTo(redirectTo);
    });
  }

  async function logout() {
    return client.logout().then(async () => {
      clearNuxtData();
      loggedIn.value = false;
      user.value = null;
      return navigateTo(config.redirect.logout);
    });
  }

  async function fetchUser() {
    //@ts-ignore
    user.value = await useDirectusRest().request(readMe());
  }

  async function refresh() {
    return client.refresh();
  }

  return { login, logout, fetchUser, refresh, loggedIn, user };
}
