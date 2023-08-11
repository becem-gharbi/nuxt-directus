import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  ssr: true,
  directus: {
    auth: {
      enabled: true,
      userFields: ["first_name", "last_name"],
    },
  },
});
