import { fileURLToPath } from "url";
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  logger,
  installModule,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import { defu } from "defu";
import type { PublicConfig } from "./runtime/types";

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
    rest: {
      baseUrl: "http://127.0.0.1:8055",
      nuxtBaseUrl: "http://127.0.0.1:3000",
    },
    graphql: {
      enabled: true,
      httpEndpoint: "http://127.0.0.1:8055/graphql",
    },
    realtime: {},
    auth: {
      enabled: true,
      msRefreshBeforeExpires: 3000,
      enableGlobalAuthMiddleware: false,
      refreshTokenCookieName: "directus_refresh_token",
      accessTokenCookieName: "directus_access_token",
      redirect: {
        home: "/home",
        login: "/auth/login",
        logout: "/auth/login",
        resetPassword: "/auth/reset-password",
        callback: "/auth/callback",
      },
    },
  },

  async setup(options, nuxt) {
    if (!options.rest.baseUrl) {
      logger.warn(`[${name}] Please make sure to set Directus baseUrl`);
    }

    if (!options.rest.nuxtBaseUrl) {
      logger.warn(`[${name}] Please make sure to set Nuxt baseUrl`);
    }

    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir);

    //Initialize the module options
    nuxt.options.runtimeConfig.public.directus = defu(
      nuxt.options.runtimeConfig.public.directus,
      options
    );

    //Add plugins
    const restPlugin = resolve(runtimeDir, "./plugins/rest");
    addPlugin(restPlugin, { append: true });

    if (options.graphql.enabled) {
      const graphqlPlugin = resolve(runtimeDir, "./plugins/graphql");
      addPlugin(graphqlPlugin, { append: true });

      await installModule("nuxt-apollo", {
        httpEndpoint: options.graphql.httpEndpoint,
        wsEndpoint: options.graphql.wsEndpoint,
      });
    }

    if (options.auth.enabled) {
      const authPlugin = resolve(runtimeDir, "./plugins/auth");
      addPlugin(authPlugin, { append: true });
    }

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);
  },
});
