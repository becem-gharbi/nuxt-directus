import { fileURLToPath } from "url";

import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
} from "@nuxt/kit";

import { defu } from "defu";
import directusServer from "./runtime/plugins/init";

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
    const directusPlugin = resolve(runtimeDir, "plugins/directus");
    const initPlugin = resolve(runtimeDir, "plugins/init");
    addPlugin(directusPlugin, { append: true });
    addPlugin(initPlugin, { append: true });

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
