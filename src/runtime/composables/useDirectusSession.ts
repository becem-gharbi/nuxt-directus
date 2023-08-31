import jwtDecode from "jwt-decode";
import {
  useRequestEvent,
  useRuntimeConfig,
  useState,
  useCookie,
  useRequestHeaders,
  navigateTo,
} from "#imports";
import {
  deleteCookie,
  getCookie,
  setCookie,
  splitCookiesString,
  appendResponseHeader,
} from "h3";

import type { AuthenticationData } from "../types";

export default function () {
  const event = useRequestEvent();
  const config = useRuntimeConfig().public.directus;

  const accessTokenCookieName = config.auth.accessTokenCookieName;
  const refreshTokenCookieName = config.auth.refreshTokenCookieName;
  const msRefreshBeforeExpires = config.auth.msRefreshBeforeExpires;
  const loggedInName = "directus_logged_in";

  const accessToken = {
    get: () =>
      useCookie(accessTokenCookieName).value,
    set: (value: string) => {
      if (process.server) {
        setCookie(event, accessTokenCookieName, value, {
          sameSite: "lax",
          secure: true,
        });
      } else {
        useCookie(accessTokenCookieName, {
          sameSite: "lax",
          secure: true,
        }).value = value;
      }
    },
    clear: () => {
      if (process.server) {
        deleteCookie(event, accessTokenCookieName);
      } else {
        useCookie(accessTokenCookieName).value = null;
      }
    },
  };

  const refreshToken = {
    get: () => process.server && getCookie(event, refreshTokenCookieName),
  };

  const loggedIn = {
    get: () => process.client && localStorage.getItem(loggedInName),
    set: (value: boolean) =>
      process.client && localStorage.setItem(loggedInName, value.toString()),
  };

  async function refresh() {
    const isRefreshOn = useState("directus-refresh-loading", () => false);
    const user = useState("directus-user");

    if (isRefreshOn.value) {
      return;
    }

    isRefreshOn.value = true;

    const cookie = useRequestHeaders(["cookie"]).cookie || "";

    await $fetch
      .raw<AuthenticationData>("/auth/refresh", {
        baseURL: config.rest.baseUrl,
        method: "POST",
        credentials: "include",
        body: {
          mode: "cookie",
        },
        headers: {
          cookie,
        },
      })
      .then((res) => {
        const setCookie = res.headers.get("set-cookie") || "";
        const cookies = splitCookiesString(setCookie);
        for (const cookie of cookies) {
          appendResponseHeader(event, "set-cookie", cookie);
        }
        if (res._data) {
          accessToken.set(res._data?.data.access_token);
          loggedIn.set(true);
        }
        isRefreshOn.value = false;
        return res;
      })
      .catch(async () => {
        isRefreshOn.value = false;
        accessToken.clear();
        loggedIn.set(false);
        user.value = null;
        if (process.client) {
          await navigateTo(config.auth.redirect.logout);
        }
      });
  }

  async function getToken() {
    const access_token = accessToken.get();

    if (access_token && isTokenExpired(access_token)) {
      await refresh();
    }

    return accessToken.get();
  }

  function isTokenExpired(token: string) {
    const decoded = jwtDecode(token) as { exp: number };
    const expires = decoded.exp * 1000 - msRefreshBeforeExpires;
    return expires < Date.now();
  }

  return { refresh, getToken, accessToken, refreshToken, loggedIn };
}
