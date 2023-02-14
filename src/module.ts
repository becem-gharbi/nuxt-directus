import { fileURLToPath } from "url";

import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  extendViteConfig,
} from "@nuxt/kit";

import { defu } from "defu";

export interface ModuleOptions {
  baseUrl: string;
  nuxtBaseUrl: string;
  auth?: {
    staticToken?: string;
    defaultRoleId?: string;
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
    baseUrl: "http://127.0.0.1:8055",
    nuxtBaseUrl: "http://127.0.0.1:3000",
    auth: {
      staticToken: "",
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
    const directusPlugin = resolve(runtimeDir, "directus");
    const initPlugin = resolve(runtimeDir, "init");
    addPlugin(directusPlugin, { append: true });
    addPlugin(initPlugin, { append: true });

    //Add composables directory
    const composables = resolve(runtimeDir, "composables");
    addImportsDir(composables);

    //Optimize axios & qs to ESM
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.include.push("axios", "qs");
    });

    //Initialize the module options
    nuxt.options.runtimeConfig.public.directus = defu(
      nuxt.options.runtimeConfig.public.directus,
      { ...options }
    );
  },
});
