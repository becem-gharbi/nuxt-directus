import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  ssr: true,
  directus: {
    auth: {
      enabled: true,
      baseUrl: "http://localhost:8055",
      nuxtBaseUrl: "http://localhost:3000",
      defaultRoleId: "90087fa8-3bf4-4e1f-9b14-f4aadb4c4d0a",
      redirect: {
        home: "/home",
        login: "/auth/login",
        logout: "/auth/login",
        resetPassword: "/auth/reset-password",
        callback: "/auth/callback",
      },
    },
  },
});
