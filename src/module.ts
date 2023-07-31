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
    baseUrl: "http://127.0.0.1:8055",
    nuxtBaseUrl: "http://127.0.0.1:3000",
    rest: {},
    graphql: {
      httpEndpoint: "http://127.0.0.1:8055/graphql",
      wsEndpoint: "ws://127.0.0.1:8055/graphql",
    },
    realtime: {},
    auth: {
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
    const restPlugin = resolve(runtimeDir, "./plugins/rest");
    const graphqlPlugin = resolve(runtimeDir, "./plugins/graphql");
    const authPlugin = resolve(runtimeDir, "./plugins/auth");
    addPlugin(restPlugin, { append: true });
    addPlugin(graphqlPlugin, { append: true });
    addPlugin(authPlugin, { append: true });

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);

    //Initialize the module options
    nuxt.options.runtimeConfig.public.directus = defu(
      //@ts-ignore
      nuxt.options.runtimeConfig.public.directus,
      { ...options }
    );

    // Integrate nuxt/apollo
    await installModule("nuxt-apollo", {
      httpEndpoint:
        nuxt.options.runtimeConfig.public.directus.graphql.httpEndpoint,
      wsEndpoint: nuxt.options.runtimeConfig.public.directus.graphql.wsEndpoint,
    });
  },
});
