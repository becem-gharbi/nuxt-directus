import { fileURLToPath } from "url";

import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
} from "@nuxt/kit";

import { defu } from "defu";
import directusServer from "./runtime/3.auth";

export interface ModuleOptions {
  baseUrl: string;
  nuxtBaseUrl: string;
  auth?: {
    defaultRoleId: string;
    enableGlobalAuthMiddleware?: boolean;
    refreshTokenCookieName?: string;
    redirect: {
      login: string;
      logout: string;
      home: string;
      callback: string;
      resetPassword: string;
    };
  };
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@bg-dev/nuxt-directus",
    configKey: "directus",
  },
  defaults: {
    baseUrl: "http://localhost:8055",
    nuxtBaseUrl: "http://localhost:3000",
    auth: {
      defaultRoleId: "",
      enableGlobalAuthMiddleware: false,
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
    //Get the runtime directory
    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL("./runtime", import.meta.url));

    //Transpile the runtime directory
    nuxt.options.build.transpile.push(runtimeDir);

    //Add plugins
    const pluginMiddlewares = resolve(runtimeDir, "1.middlewares");
    const pluginDirectus = resolve(runtimeDir, "2.directus");
    const pluginAuth = resolve(runtimeDir, "3.auth");
    addPlugin(pluginMiddlewares, { append: true });
    addPlugin(pluginDirectus, { append: true });
    addPlugin(pluginAuth, { append: true });

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
