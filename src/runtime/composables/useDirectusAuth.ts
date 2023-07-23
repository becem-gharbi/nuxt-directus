import { authentication } from "@directus/sdk";
import { useRuntimeConfig } from "#app";
import useDirectus from "./useDirectus";

import type { Authentication } from "../types/config";
import type { LoginCredentials } from "../types/index";
import type { AuthenticationStorage, AuthenticationData } from "@directus/sdk";

export default function useDirectusAuth() {
  const loggedIn = useState("directus-logged-in", () =>
    useCookie("access_token").value ? true : false
  );

  const config = useRuntimeConfig().public.directus.auth as Authentication;

  const storage: AuthenticationStorage = {
    get() {
      const data: AuthenticationData = {
        access_token: useCookie("access_token").value || "",
        expires: parseInt(useCookie("directus_expires").value || ""),
        expires_at: parseInt(useCookie("directus_expires_at").value || ""),
        refresh_token: useCookie("directus_refresh_token").value || "",
      };

      return data;
    },

    set(data) {
      const maxAge = data?.expires && data.expires / 1000;
      const options = maxAge ? { maxAge } : {};

      useCookie("access_token", options).value = data?.access_token;
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

  async function login(credentials: LoginCredentials) {
    const route = useRoute();

    return client
      .login(credentials.email, credentials.password)
      .then(async () => {
        const returnToPath = route.query.redirect?.toString();
        const redirectTo = returnToPath || config.redirect.home;
        loggedIn.value = true;
        return navigateTo(redirectTo);
      });
  }

  async function logout() {
    return client.logout().then(async () => {
      clearNuxtData();
      loggedIn.value = false;
      return navigateTo(config.redirect.logout);
    });
  }

  return { login, logout, loggedIn };
}
