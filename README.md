## Nuxt Directus

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

A Nuxt 3 module for integrating the official Directus JS SDK into your Nuxt 3 project

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
npm install --save-dev @bg-dev/nuxt-directus

# Using yarn
yarn add --dev @bg-dev/nuxt-directus
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
      refreshTokenCookieName: "directus_refresh_token",
      defaultRoleId: "", // Role id assigned for new registered users
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

- Directus and Nuxt apps SHOULD share the same domain name (SameSite cookies), in development domain SHOULD be 127.0.0.1 ([issue](https://github.com/unjs/ofetch/issues/156))
- Refer to [directus docs](https://docs.directus.io/self-hosted/sso.html) for general configuration

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
[npm-downloads-src]: https://img.shields.io/npm/dm/@bg-dev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@bg-dev/nuxt-directus
[license-src]: https://img.shields.io/npm/l/@bg-dev/nuxt-directus.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@bg-dev/nuxt-directus
[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?logo=nuxt.js
[nuxt-href]: https://nuxt.com
