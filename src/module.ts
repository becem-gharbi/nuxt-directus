import { fileURLToPath } from "url";
import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  logger,
  installModule,
  addImports,
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
    auth: {
      enabled: true,
      userFields: ['*'],
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

    //Auto-import Directus SDK rest commands
    const commands = [
      "createComment",
      "updateComment",
      "deleteComment",
      "createField",
      "createItem",
      "createItems",
      "deleteField",
      "deleteFile",
      "deleteFiles",
      "readActivities",
      "readActivity",
      "deleteItem",
      "deleteItems",
      "deleteUser",
      "deleteUsers",
      "importFile",
      "readCollection",
      "readCollections",
      "createCollection",
      "updateCollection",
      "deleteCollection",
      "readField",
      "readFieldsByCollection",
      "readFields",
      "readFile",
      "readFiles",
      "readItem",
      "readItems",
      "readSingleton",
      "readMe",
      "createUser",
      "createUsers",
      "readUser",
      "readUsers",
      "updateField",
      "updateFile",
      "updateFiles",
      "updateFolder",
      "updateFolders",
      "updateItem",
      "updateItems",
      "updateSingleton",
      "updateMe",
      "updateUser",
      "updateUsers",
      "uploadFiles",
      "withToken",
    ];

    commands.forEach((name) => {
      addImports({
        name: name,
        as: name,
        from: "@directus/sdk",
      });
    });
  },
});
