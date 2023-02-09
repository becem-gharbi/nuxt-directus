import {
  defineNuxtPlugin,
  useRuntimeConfig,
  useCookie,
  useRequestEvent,
} from "#app";
import {
  Directus,
  ITransport,
  TransportResponse,
  TransportRequestOptions,
  BaseStorage,
} from "@directus/sdk";
import { appendHeader, setCookie } from "h3";

function extractCookie(cookies: string, name: string) {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export default defineNuxtPlugin(async () => {
  const publicConfig = useRuntimeConfig().public.directus;
  const event = useRequestEvent();
  const cookies = useRequestHeaders(["cookie"]).cookie || "";
  let temp: Record<string, string> = {};

  class MyTransport extends ITransport {
    async buildResponse<T>(
      method: "GET" | "POST" | "HEAD" | "OPTIONS" | "DELETE" | "PUT" | "PATCH",
      path: string,
      options?: TransportRequestOptions,
      data?: any
    ) {
      console.log("hitting ", { path });

      if (path === "/auth/refresh" && method === "POST") {
        if (process.server) {
          options = {
            ...options,
            headers: {
              ...options?.headers,
              cookie: cookies,
              Authorization: null,
            },
          };
        }
      } else if (directus.storage.auth_token) {
        await directus.auth.refreshIfExpired();
        options = {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Bearer ${directus.storage.auth_token}`,
          },
        };
      }

      return $fetch
        .raw<T>(path, {
          baseURL: publicConfig.baseUrl,
          method: method,
          query: options?.params,
          credentials: "include",
          headers: options?.headers,
          body: data,
        })
        .then((res) => {
          if (path === "/auth/refresh" && method === "POST" && process.server) {
            const setCookies = res.headers.get("set-cookie") || "";
            appendHeader(event, "set-cookie", setCookies);
          }
          return {
            raw: "",
            //@ts-ignore
            data: res._data["data"],
            status: res.status,
            headers: res.headers,
          } as TransportResponse<T>;
        });
    }

    async get<T = any, R = any>(
      path: string,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("GET", path, options);
    }
    async head<T = any, R = any>(
      path: string,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("HEAD", path, options);
    }
    async options<T = any, R = any>(
      path: string,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("OPTIONS", path, options);
    }
    async delete<T = any, P = any, R = any>(
      path: string,
      data?: P,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("DELETE", path, options, data);
    }
    async post<T = any, P = any, R = any>(
      path: string,
      data?: P,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("POST", path, options, data);
    }
    async put<T = any, P = any, R = any>(
      path: string,
      data?: P,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("PUT", path, options, data);
    }
    async patch<T = any, P = any, R = any>(
      path: string,
      data?: P,
      options?: TransportRequestOptions
    ) {
      return this.buildResponse<T>("PATCH", path, options, data);
    }
  }

  class MyStorage extends BaseStorage {
    get(key: string) {
      if (process.server) {
        return temp[key] || extractCookie(cookies, key) || "";
      } else {
        const cookie = useCookie(key);
        return cookie.value || "";
      }
    }
    set(key: string, value: string) {
      if (process.server) {
        setCookie(event, key, value);
        temp[key] = value;
      } else {
        const cookie = useCookie(key);
        cookie.value = value;
      }
      return value;
    }
    delete(key: string) {
      if (process.server) {
        setCookie(event, key, "");
        temp[key] = "";
      } else {
        const cookie = useCookie(key);
        cookie.value = null;
      }
      return null;
    }
  }

  const directus = new Directus(publicConfig.baseUrl, {
    storage: new MyStorage(),
    auth: {
      autoRefresh: true,
      mode: "cookie",
      msRefreshBeforeExpires: 3000,
    },
    transport: new MyTransport(),
  });

  return {
    provide: {
      directus: directus,
    },
  };
});
