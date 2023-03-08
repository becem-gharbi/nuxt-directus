import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  ssr: true,
  directus: {
    auth: {},
    // auth: {
    //   defaultRoleId: "722a1f32-cf16-4a09-942e-148885df0ec2",
    //   redirect: {
    //     home: "/home",
    //     login: "/auth/login",
    //     logout: "/auth/login",
    //     resetPassword: "/auth/reset-password",
    //     callback: "/auth/callback",
    //   },
    // },
  },
});
