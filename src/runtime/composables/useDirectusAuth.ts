import { authentication } from "@directus/sdk";
import { useRuntimeConfig } from "#app";
import useDirectus from "./useDirectus";
import type { Authentication } from "../types/config";
import type { LoginCredentials } from "../types/index";

export default function useDirectusAuth() {
  const loggedIn = useState("directus-logged-in", () => false);

  const config = useRuntimeConfig().public.directus.auth as Authentication;

  const client = useDirectus().with(
    authentication(config.mode, {
      autoRefresh: config.autoRefresh,
      msRefreshBeforeExpires: config.msRefreshBeforeExpires,
      storage: config.storage,
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

  async function refresh() {
    return client.refresh();
  }

  return { login, logout, refresh, loggedIn };
}
