## Nuxt Directus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Directus SDK for Nuxt 3

- ✔️ SSR support
- ✔️ Rest client via `useDirectusRest` composable based on the new [Directus SDK](https://github.com/directus/directus/tree/main/sdk)
- ✔️ Graphql client based on [Nuxt Apollo](https://github.com/becem-gharbi/nuxt-apollo) module
- ✔️ Auth handler via `useDirectusAuth` with auto refresh of access token and auto redirection.
- ✔️ Ready to use [starter](https://github.com/becem-gharbi/directus-starter)

## Installation

Add `@bg-dev/nuxt-directus` dependency to your project

```bash
# Using pnpm
pnpm install --save-dev @bg-dev/nuxt-directus

# Using yarn
yarn add --dev @bg-dev/nuxt-directus
```

## Setup

Add `@bg-dev/nuxt-directus` to the `modules` section of `nuxt.config.ts` and set directus options

```js
export default defineNuxtConfig({
  modules: ["@bg-dev/nuxt-directus"],

  directus: {
    rest: {
      baseUrl: "http://localhost:8055", // Directus app base url
      nuxtBaseUrl: "http://localhost:3000", // Nuxt app base url
    },
    graphql: {
      enabled: true,
      httpEndpoint: "http://localhost:8055/graphql",
      wsEndpoint: "", // Omit to disable Websockets
    },
    auth: {
      enabled: true,
      enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
      userFields: ["*"], // Select user fields
      refreshTokenCookieName: "directus_refresh_token",
      accessTokenCookieName: "directus_access_token",
      msRefreshBeforeExpires: 3000,
      redirect: {
        login: "/auth/login", // Path to redirect when login is required
        logout: "/auth/login", // Path to redirect after logout
        home: "/home", // Path to redirect after successful login
        resetPassword: "/auth/reset-password", // Path to redirect for password reset
        callback: "/auth/callback", // Path to redirect after login with provider
      },
    },
  },
});
```

That's it! You can now use `@bg-dev/nuxt-directus` in your Nuxt app ✨

## REST

The module has `useDirectusRest` composable for data fetching with REST API. It is a wrapper around Directus SDK `request` API with auto refresh of access token and auto-imported commands.
For better DX, you can get the types definition of your directus project via [directus-extension-generate-types](https://github.com/maltejur/directus-extension-generate-types). The generated `types.ts` file can be used in your Nuxt project via the global `DirectusSchema` type.

```ts
import { CustomDirectusTypes } from "./types";

type DirectusTypes =
  | "directus_activity"
  | "directus_collections"
  | "directus_dashboards"
  | "directus_fields"
  | "directus_files"
  | "directus_flows"
  | "directus_folders"
  | "directus_migrations"
  | "directus_notifications"
  | "directus_operations"
  | "directus_panels"
  | "directus_permissions"
  | "directus_presets"
  | "directus_relations"
  | "directus_revisions"
  | "directus_roles"
  | "directus_sessions"
  | "directus_settings"
  | "directus_shares"
  | "directus_translations"
  | "directus_users"
  | "directus_webhooks";

declare global {
  interface DirectusSchema extends Omit<CustomDirectusTypes, DirectusTypes> {}
}
```

## Graphql

The module uses [nuxt-apollo](https://github.com/becem-gharbi/nuxt-apollo) for Graphql data fetching with auto refresh of access token. Please refer to docs for API usage and DX optimizations.
To use graphql subscription make sure to set

- `WEBSOCKETS_ENABLED` env to `true`
- `WEBSOCKETS_GRAPHQL_ENABLED` env to `true`

## Auth

Directus and Nuxt apps should share the same domain name because cookies's sameSite policy is set to `lax`. Also make sure to add `NODE_OPTIONS=--dns-result-order=ipv4first` env in development in order to resolve localhost domain for Node +v17.

The module has `useDirectusAuth` composable for handling authentication with cookie based storage.

- `login` login with email/password and redirect to login page
- `logout` logout, clear states and redirect to logout page
- `fetchUser` call to refetch and refresh `user` state
- `loginWithProvider` login with SSO provider and redirect to login page on success and callback page otherwise
- `requestPasswordReset`
- `resetPassword`

To implement a custom logic on user login/logout events, you can use `directus:loggedIn` hook

```js
export default defineNuxtPlugin({
  enforce: "pre", // Should be registered before built-in `auth` plugin
  hooks: {
    "directus:loggedIn": (state) => {},
  },
});
```

For protecting page routes, 2 possible approachs can be used:

- Globally enable and locally disable

```js
enableGlobalAuthMiddleware: true;
```

```js
definePageMeta({ auth: false });
```

- Locally enable

```js
definePageMeta({ middleware: "auth" }); // Redirects to login path when not loggedIn
```

```js
definePageMeta({ middleware: "guest" }); // Redirects to home path when loggedIn
```

## License

[MIT License](./LICENSE)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@bg-dev/nuxt-directus/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@bg-dev/nuxt-directus
[npm-downloads-src]: https://img.shields.io/npm/dt/@bg-dev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@bg-dev/nuxt-directus
[license-src]: https://img.shields.io/npm/l/@bg-dev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@bg-dev/nuxt-directus
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
