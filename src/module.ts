import { fileURLToPath } from "url";
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  extendViteConfig,
  logger,
} from "@nuxt/kit";
import { name, version } from "../package.json";
import { defu } from "defu";

export interface ModuleOptions {
  baseUrl: string;
  nuxtBaseUrl: string;
  auth?: {
    enabled: boolean;
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
    auth: {
      enabled: false,
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
    if (!options.baseUrl) {
      logger.warn(
        `Please make sure to set Directus baseUrl in ${name} options`
      );
    }

    if (!options.nuxtBaseUrl) {
      logger.warn(`Please make sure to set Nuxt baseUrl in ${name} options`);
    }

    if (!options.auth?.enabled) {
      logger.info(`Auth is disabled in ${name} options`);
    }

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
