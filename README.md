## Nuxt Directus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Directus SDK for Nuxt 3

**IMPORTANT**

_This version `2` is a complete rewrite of the module. You can find the old version aka `v1` under `version-1` branch._

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
      baseUrl: "http://127.0.0.1:8055", // Directus app base url
      nuxtBaseUrl: "http://127.0.0.1:3000", // Nuxt app base url
    },
    graphql: {
      enabled: true,
      httpEndpoint: "http://127.0.0.1:8055/graphql",
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
For better DX, you can get the types definition of your directus project via [directus-extension-generate-types](https://github.com/maltejur/directus-extension-generate-types). The generated `types.ts` file can be used in your Nuxt project via `global.d.ts` file.

```js
import { CustomDirectusTypes } from "./types";

declare global {
  interface DirectusSchema extends CustomDirectusTypes {}
}
```

## Graphql

The module uses [nuxt-apollo](https://github.com/becem-gharbi/nuxt-apollo) for Graphql data fetching with auto refresh of access token. Please refer to docs for API usage and DX optimizations.
To use graphql subscription make sure to set

- `WEBSOCKETS_ENABLED` env to `true`
- `WEBSOCKETS_GRAPHQL_ENABLED` env to `true`

## Auth

The module has `useDirectusAuth` composable for handling authentication with cookie based storage. It expose these methods

- `login` login with email/password and redirect to login page
- `logout` logout, clear storage and redirect to logout page
- `fetchUser` call to refetch and refresh `user` state
- `loginWithProvider` login with SSO provider and redirect to login page on success and callback page otherwise
- `getToken` get a fresh access token means it will be refreshed on expiration
- `requestPasswordReset`
- `resetPassword`

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
## Notes

- When auth is enabled, Directus and Nuxt apps SHOULD share the same domain name because cookies's sameSite policy is set to `lax`, in development domain SHOULD be 127.0.0.1 ([issue](https://github.com/unjs/ofetch/issues/156))

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

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
