## Nuxt Directus

A Nuxt 3 module for integrating the official Directus [JS SDK](https://github.com/directus/sdk) into your Nuxt 3 project.

**IMPORTANT**

_This version `1` is based on version `10` of Directus SDK, which is no longer supported as indicated by [docs](https://docs.directus.io/reference/old-sdk.html). It will still be maintained, but it's recommended to migrate to version `2` to benefit the features of latest Directus SDK._

## Features

- ✔️ Customized Transport & Storage for Nuxt 3
- ✔️ Handles authentication via `useDirectusAuth`
  composable
- ✔️ Provides auth route middlewares
- ✔️ Auto refresh of access token
- ✔️ Exposes directus instance via `useDirectus` composable
- ✔️ Typescript support

## Installation

Add `@bg-dev/nuxt-directus` dependency to your project

```bash
# Using npm
npm install --save-dev @bg-dev/nuxt-directus@1

# Using yarn
yarn add --dev @bg-dev/nuxt-directus@1
```

## Setup

Add `@bg-dev/nuxt-directus` to the `modules` section of `nuxt.config.ts` and set directus options

```js
export default defineNuxtConfig({
  modules: ["@bg-dev/nuxt-directus"],

  directus: {
    baseUrl: "http://127.0.0.1:8055", // Directus app base url
    nuxtBaseUrl: "http://127.0.0.1:3000", // Nuxt app base url
    auth: {
      enabled: false,
      enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
      userFields: [], // Select user fields
      refreshTokenCookieName: "directus_refresh_token",
      defaultRoleId: "", // Role id assigned for new registered users
      redirect: {
        login: "/auth/login", // Path to redirect when login is required
        logout: "/auth/login", // Path to redirect after logout
        home: "/home", // Path to redirect after successful login
        resetPassword: "/auth/reset-password", // Path to redirect for password reset
        callback: "/auth/callback", // Path to redirect after login with provider
        loggedOut: "", // Path to redirect when loggedIn & refresh token is expired
      },
    },
  },
});
```

That's it! You can now use `@bg-dev/nuxt-directus` in your Nuxt app ✨

## Typescript

For better DX, you can get the types definition of your directus project via [directus-extension-generate-types](https://github.com/maltejur/directus-extension-generate-types). The generated `types.ts` file can be used in your Nuxt project via `global.d.ts` file.

```js
import { CustomDirectusTypes } from "./types";

declare global {
  type MyDirectusTypes = CustomDirectusTypes;
}
```

## Usage

Refer to [Directus SDK](https://github.com/directus/sdk) for api documentation.

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
- Refer to [directus docs](https://docs.directus.io/self-hosted/sso.html) for general configuration

## License

[MIT License](./LICENSE)
