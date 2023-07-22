import { fileURLToPath } from "url";
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  logger,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import { defu } from "defu";
import type { PublicConfig } from "./runtime/types/config";

export interface ModuleOptions extends PublicConfig {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: "directus",
    compatibility: {
      nuxt: "^3.0.0",
    },
  },

  defaults: {
    baseUrl: "http://127.0.0.1:8055",
    nuxtBaseUrl: "http://127.0.0.1:3000",
    rest: {},
    graphql: {},
    realtime: {},
    auth: {
      enableGlobalAuthMiddleware: false,
      userFields: [],
      refreshTokenCookieName: "directus_refresh_token",
      redirect: {
        home: "/home",
        login: "/auth/login",
        logout: "/auth/login",
        resetPassword: "/auth/reset-password",
        callback: "/auth/callback",
      },
    },
  },

  setup(options, nuxt) {
    if (!options.baseUrl) {
      logger.warn(`[${name}] Please make sure to set Directus baseUrl`);
    }

    if (!options.nuxtBaseUrl) {
      logger.warn(`[${name}] Please make sure to set Nuxt baseUrl`);
    }

    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir);

    //Add plugins
    const directusPlugin = resolve(runtimeDir, "directus");
    addPlugin(directusPlugin, { append: true });

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);

    //Initialize the module options
    nuxt.options.runtimeConfig.public.directus = defu(
      nuxt.options.runtimeConfig.public.directus,
      { ...options }
    );
  },
});
