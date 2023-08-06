import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  ssr: false,
  directus: {
    auth: {
      enabled: true,
      userFields: ["first_name", "last_name"],
    },
  },
});
