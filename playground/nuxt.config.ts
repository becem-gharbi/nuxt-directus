import { defineNuxtConfig } from "nuxt/config";
import myModule from "..";

export default defineNuxtConfig({
  //@ts-ignore
  modules: [myModule],
  ssr: true,
  directus: {
    graphql: {
      enabled: false,
    },
    auth: {
      enabled: false,
    },
  },
});
