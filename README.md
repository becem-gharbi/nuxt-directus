# Nuxt Directus

Directus sdk for Nuxt 3 applications

## Features

✔️ Support for Universal and SPA Nuxt 3 apps <br>
✔️ Handles authentication through `useDirectusAuth`
composable<br>
✔️ Page route protection with auto redirection<br>
✔️ Auto refresh of access token<br>
✔️ Expose directus instance via `$directus` helper<br>
✔️ Typescript support

## 👉 Demo [nuxt-directus-starter](https://directus-starter.bg-corner.tech/)

## Installation

```bash
npm i @bg-dev/nuxt-directus
```

## Setup

Add `@bg-dev/nuxt-directus` to your nuxt modules and set `directus` options

```javascript
export default defineNuxtConfig({
  //...
  modules: ["@bg-dev/nuxt-directus"],
  directus: {
    baseUrl: "http://127.0.0.1:8055", // Directus app base url
    nuxtBaseUrl: "http://127.0.0.1:3000", // Nuxt app base url
    auth: {
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
  //...
});
```

Add your collections's types definition for better DX by setting `DirectusCollections` in the global typescript declaration file `./global.d.ts`

```typescript
type DirectusCollections = {
  collection: {};
};
```

## Usage

Refer to [Directus SDK](https://github.com/directus/sdk) for api documentation.

For protecting routes, 2 possible approachs can be used:

- Globally enable and locally disable

```javascript
enableGlobalAuthMiddleware: true;
```

```javascript
definePageMeta({ auth: false });
```

- Locally enable

```javascript
definePageMeta({ middleware: "auth" }); // Redirects to login path when not loggedIn
```

```javascript
definePageMeta({ middleware: "guest" }); // Redirects to home path when loggedIn
```

## Notes

- Directus and Nuxt apps SHOULD share the same domain name (SameSite cookies), in development domain SHOULD be 127.0.0.1 ([issue](https://github.com/unjs/ofetch/issues/156))
- Refer to [directus docs](https://docs.directus.io/self-hosted/sso.html) for general configuration

## Development

- Run `npm run dev:prepare` to generate type stubs.
- Use `npm run dev` to start [playground](./playground) in development mode.
