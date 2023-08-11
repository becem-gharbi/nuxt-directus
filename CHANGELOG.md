# Changelog


## v2.2.6-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.2.5-beta...v2.2.6-beta)

### 💅 Refactors

- Pass cookies from server-side on SSR response as suggested by docs ([0fbf849](https://github.com/becem-gharbi/nuxt-directus/commit/0fbf849))
- **refresh:** Some refactoring ([c5b4cbc](https://github.com/becem-gharbi/nuxt-directus/commit/c5b4cbc))
- Create useDirectusStorage to handle auth session ([a6461c6](https://github.com/becem-gharbi/nuxt-directus/commit/a6461c6))

### 📖 Documentation

- Update readme ([732a8b1](https://github.com/becem-gharbi/nuxt-directus/commit/732a8b1))

### 🏡 Chore

- Add refresh flowchart ([68b8253](https://github.com/becem-gharbi/nuxt-directus/commit/68b8253))
- Update design ([f2407a0](https://github.com/becem-gharbi/nuxt-directus/commit/f2407a0))
- Update design ([6ef7e01](https://github.com/becem-gharbi/nuxt-directus/commit/6ef7e01))
- Update design ([e081977](https://github.com/becem-gharbi/nuxt-directus/commit/e081977))
- Set tag to latest ([ab2bec9](https://github.com/becem-gharbi/nuxt-directus/commit/ab2bec9))
- Upgrade dependencies ([962071f](https://github.com/becem-gharbi/nuxt-directus/commit/962071f))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.2.5-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.2.4-beta...v2.2.5-beta)

### 🩹 Fixes

- Keep user loggedIn after browser session ends ([471e66b](https://github.com/becem-gharbi/nuxt-directus/commit/471e66b))
- Prevent localStorage calls on SSR ([97b88da](https://github.com/becem-gharbi/nuxt-directus/commit/97b88da))
- Prevent concurrent refresh calls ([f73ada0](https://github.com/becem-gharbi/nuxt-directus/commit/f73ada0))
- **logout:** Clear storage & redirect regardless of fetch result ([a6d3a8b](https://github.com/becem-gharbi/nuxt-directus/commit/a6d3a8b))

### 💅 Refactors

- Name useState keys in kebab-case ([04fd6a4](https://github.com/becem-gharbi/nuxt-directus/commit/04fd6a4))
- Remove accessTokenCookieMaxAge config option ([44e63f4](https://github.com/becem-gharbi/nuxt-directus/commit/44e63f4))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.2.4-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.2.3-beta...v2.2.4-beta)

### 🩹 Fixes

- Store access token in long-lived cookie ([7e992de](https://github.com/becem-gharbi/nuxt-directus/commit/7e992de))

### 📖 Documentation

- Add notes section ([1bf7278](https://github.com/becem-gharbi/nuxt-directus/commit/1bf7278))
- Add accessTokenCookieMaxAge config option ([1dfc4eb](https://github.com/becem-gharbi/nuxt-directus/commit/1dfc4eb))

### 🏡 Chore

- Add accessTokenCookieMaxAge config option ([1deba60](https://github.com/becem-gharbi/nuxt-directus/commit/1deba60))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v2.2.3-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.2.2-beta...v2.2.3-beta)

### 🩹 Fixes

- **auth:** Add opt input option to login ([1e9bb16](https://github.com/becem-gharbi/nuxt-directus/commit/1e9bb16))

### 💅 Refactors

- **auth:** Set userFields default value on fetchUser ([937dc4b](https://github.com/becem-gharbi/nuxt-directus/commit/937dc4b))

### 📖 Documentation

- Update starter URL ([976227b](https://github.com/becem-gharbi/nuxt-directus/commit/976227b))
- Replace npm with pnpm ([e1b7359](https://github.com/becem-gharbi/nuxt-directus/commit/e1b7359))
- Add userFields to config options ([e644f4c](https://github.com/becem-gharbi/nuxt-directus/commit/e644f4c))

### 🌊 Types

- Extend user type with DirectusSchema ([6913adb](https://github.com/becem-gharbi/nuxt-directus/commit/6913adb))

### 🏡 Chore

- Remove demo ([c910b45](https://github.com/becem-gharbi/nuxt-directus/commit/c910b45))

### ❤️  Contributors

- Becem Gharbi ([@becem-gharbi](http://github.com/becem-gharbi))
- Becem ([@becem-gharbi](http://github.com/becem-gharbi))

## v2.2.2-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.2.1-beta...v2.2.2-beta)

### 🩹 Fixes

- **auth:** Fix duplicate fetchUser calls on SSO login ([793e1b2](https://github.com/becem-gharbi/nuxt-directus/commit/793e1b2))

### 📖 Documentation

- Update README ([937833e](https://github.com/becem-gharbi/nuxt-directus/commit/937833e))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.2.1-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.2.0-beta...v2.2.1-beta)

### 💅 Refactors

- Set access token cookie to session and store max-age on another cookie ([4431e71](https://github.com/becem-gharbi/nuxt-directus/commit/4431e71))
- Check access token expiration from payload ([159def7](https://github.com/becem-gharbi/nuxt-directus/commit/159def7))

### 📖 Documentation

- Update README ([4b01e84](https://github.com/becem-gharbi/nuxt-directus/commit/4b01e84))
- Update README ([38955a9](https://github.com/becem-gharbi/nuxt-directus/commit/38955a9))
- Update README ([c081db7](https://github.com/becem-gharbi/nuxt-directus/commit/c081db7))
- Update README ([f6f2970](https://github.com/becem-gharbi/nuxt-directus/commit/f6f2970))

### 🏡 Chore

- **demo:** Upgrade dependencies ([1ed2666](https://github.com/becem-gharbi/nuxt-directus/commit/1ed2666))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.2.0-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.1.2-beta...v2.2.0-beta)

### 🚀 Enhancements

- **rest:** Auto-import commonly used commands ([de5149d](https://github.com/becem-gharbi/nuxt-directus/commit/de5149d))
- **auth:** Add requestPasswordReset & resetPassword methods ([280a4e2](https://github.com/becem-gharbi/nuxt-directus/commit/280a4e2))

### 🔥 Performance

- Conditional usage of extensions with enabled config option ([b059945](https://github.com/becem-gharbi/nuxt-directus/commit/b059945))

### 🩹 Fixes

- **auth:** Redirect to logout page on refresh fail ([f02d79a](https://github.com/becem-gharbi/nuxt-directus/commit/f02d79a))

### 💅 Refactors

- Update plugins names and paths ([3b39434](https://github.com/becem-gharbi/nuxt-directus/commit/3b39434))
- Move baseUrl & nuxtBaseUrl under rest config option ([4325a1f](https://github.com/becem-gharbi/nuxt-directus/commit/4325a1f))
- **rest:** Create rest client on plugin ([a7db7ee](https://github.com/becem-gharbi/nuxt-directus/commit/a7db7ee))

### 🌊 Types

- Set  graphql & auth types based on enabled value ([ddebc14](https://github.com/becem-gharbi/nuxt-directus/commit/ddebc14))

### 🏡 Chore

- **demo:** Upgrade dependencies ([2bfec36](https://github.com/becem-gharbi/nuxt-directus/commit/2bfec36))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.1.2-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.1.1-beta...v2.1.2-beta)

### 📖 Documentation

- Update README ([80dab34](https://github.com/becem-gharbi/nuxt-directus/commit/80dab34))

### 🏡 Chore

- **demo:** Upgrade dependencies ([0ca9779](https://github.com/becem-gharbi/nuxt-directus/commit/0ca9779))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.1.1-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.1.0-beta...v2.1.1-beta)

### 🩹 Fixes

- Replace @nuxtjs/apollo with nuxt-apollo ([df1d5eb](https://github.com/becem-gharbi/nuxt-directus/commit/df1d5eb))

### 📖 Documentation

- Update README ([5478f8f](https://github.com/becem-gharbi/nuxt-directus/commit/5478f8f))

### 🏡 Chore

- **demo:** Update dependencies ([e78a1e4](https://github.com/becem-gharbi/nuxt-directus/commit/e78a1e4))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.1.0-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v2.0.1-beta...v2.1.0-beta)

### 🚀 Enhancements

- **graphql:** Add apollo authentication hook ([3b6aebc](https://github.com/becem-gharbi/nuxt-directus/commit/3b6aebc))

### 🩹 Fixes

- **graphql:** Add missing @vue/apollo-composable module ([dd38d03](https://github.com/becem-gharbi/nuxt-directus/commit/dd38d03))

### 💅 Refactors

- **auth:** Add getToken to get fresh access token ([6bc141d](https://github.com/becem-gharbi/nuxt-directus/commit/6bc141d))
- Add graphql endpoints config options ([dff06e2](https://github.com/becem-gharbi/nuxt-directus/commit/dff06e2))

### 📖 Documentation

- Update README ([7dfae31](https://github.com/becem-gharbi/nuxt-directus/commit/7dfae31))
- Add graphql instructions ([7983417](https://github.com/becem-gharbi/nuxt-directus/commit/7983417))

### 🏡 Chore

- **demo:** Upgrade dependencies ([77b5f09](https://github.com/becem-gharbi/nuxt-directus/commit/77b5f09))
- **demo:** UI refactor ([ed61bb7](https://github.com/becem-gharbi/nuxt-directus/commit/ed61bb7))
- **graphql:** Add @nuxtjs/apollo module ([d65d1eb](https://github.com/becem-gharbi/nuxt-directus/commit/d65d1eb))
- **graphql:** Add codegen & graphql vscode extension config files ([0844074](https://github.com/becem-gharbi/nuxt-directus/commit/0844074))
- **graphql:** Test codegen and query auto suggestion ([4b06c03](https://github.com/becem-gharbi/nuxt-directus/commit/4b06c03))
- **demo:** Test graphql subscription ([0df47e6](https://github.com/becem-gharbi/nuxt-directus/commit/0df47e6))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v2.0.1-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.2.1-beta...v2.0.1-beta)

### 🏡 Chore

- Bump version to 2 ([3be812a](https://github.com/becem-gharbi/nuxt-directus/commit/3be812a))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.2.1-beta

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.1-next...v0.2.1-beta)

### 📖 Documentation

- Update README ([c4ca636](https://github.com/becem-gharbi/nuxt-directus/commit/c4ca636))
- Update README ([ac7d686](https://github.com/becem-gharbi/nuxt-directus/commit/ac7d686))
- Update config options ([6a94705](https://github.com/becem-gharbi/nuxt-directus/commit/6a94705))

### 🏡 Chore

- Bump version to 2 ([d01be5e](https://github.com/becem-gharbi/nuxt-directus/commit/d01be5e))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.1-next

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.0.2-next...v0.1.1-next)

### 🚀 Enhancements

- **rest:** Set useDirectusRest as wrapper for request method ([35e9aa6](https://github.com/becem-gharbi/nuxt-directus/commit/35e9aa6))
- **auth:** Implement login & logout from REST ([45426ad](https://github.com/becem-gharbi/nuxt-directus/commit/45426ad))
- **auth:** Implement refresh from REST ([531b8e7](https://github.com/becem-gharbi/nuxt-directus/commit/531b8e7))
- **auth:** Implement custom storage ([0c7b6aa](https://github.com/becem-gharbi/nuxt-directus/commit/0c7b6aa))
- **auth:** Implement client side auto refresh ([a87b4f9](https://github.com/becem-gharbi/nuxt-directus/commit/a87b4f9))
- **auth:** Implement universal auto refresh ([82f3032](https://github.com/becem-gharbi/nuxt-directus/commit/82f3032))
- **auth:** Add loginWithProvider for SSO login ([51c9551](https://github.com/becem-gharbi/nuxt-directus/commit/51c9551))

### 🩹 Fixes

- **auth:** Clear storage of refresh fail ([0e88b8b](https://github.com/becem-gharbi/nuxt-directus/commit/0e88b8b))
- **auth:** On SSR share access token via vent object ([29d34d9](https://github.com/becem-gharbi/nuxt-directus/commit/29d34d9))
- **auth:** Update conditions for fetchUser on initilization ([41c489b](https://github.com/becem-gharbi/nuxt-directus/commit/41c489b))
- **auth:** Add delay between login & fetchUser to insure access token cookie is set ([ceb9791](https://github.com/becem-gharbi/nuxt-directus/commit/ceb9791))

### 💅 Refactors

- Insure config variable always refer to module options ([5218e10](https://github.com/becem-gharbi/nuxt-directus/commit/5218e10))
- **init plugin:** Remove unnecessary useInitialized method ([4fc44a9](https://github.com/becem-gharbi/nuxt-directus/commit/4fc44a9))
- Remove useDirectus as it might be misleading ([90da8bb](https://github.com/becem-gharbi/nuxt-directus/commit/90da8bb))
- **auth:** Update login signature to match sdk ([061b43a](https://github.com/becem-gharbi/nuxt-directus/commit/061b43a))
- Add accessTokenCookieName config option ([03fef2c](https://github.com/becem-gharbi/nuxt-directus/commit/03fef2c))
- Add msRefreshBeforeExpires config option to account for network latency ([9e63941](https://github.com/becem-gharbi/nuxt-directus/commit/9e63941))

### 📖 Documentation

- Update todos list ([fef5051](https://github.com/becem-gharbi/nuxt-directus/commit/fef5051))
- **readme:** Remove new sdk beta warning ([964cf20](https://github.com/becem-gharbi/nuxt-directus/commit/964cf20))
- **readme:** Update Todos & config options ([88c4e85](https://github.com/becem-gharbi/nuxt-directus/commit/88c4e85))
- **readme:** Update new sdk url ([5e10844](https://github.com/becem-gharbi/nuxt-directus/commit/5e10844))

### 🌊 Types

- Add $directus helper type ([e8460e6](https://github.com/becem-gharbi/nuxt-directus/commit/e8460e6))
- Rename MyDirectusTypes to DirectusSchema, check readme ([176509a](https://github.com/becem-gharbi/nuxt-directus/commit/176509a))
- Update AuthStorage type definition ([9102f78](https://github.com/becem-gharbi/nuxt-directus/commit/9102f78))

### 🏡 Chore

- Upgrade to latest @directus/sdk ([234d7dc](https://github.com/becem-gharbi/nuxt-directus/commit/234d7dc))
- **demo:** Test schema type injection ([9edfcd9](https://github.com/becem-gharbi/nuxt-directus/commit/9edfcd9))
- **demo:** Test auth ([5951d57](https://github.com/becem-gharbi/nuxt-directus/commit/5951d57))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.0.2-next

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.0.1-next...v0.0.2-next)

### 🚀 Enhancements

- Create $directus helper ([e497fcb](https://github.com/becem-gharbi/nuxt-directus/commit/e497fcb))
- Create useDirectusRest composable ([c398690](https://github.com/becem-gharbi/nuxt-directus/commit/c398690))
- Create useDirectusAuth composable ([ee8c21c](https://github.com/becem-gharbi/nuxt-directus/commit/ee8c21c))
- **auth:** Add login & logout methods ([80f5e25](https://github.com/becem-gharbi/nuxt-directus/commit/80f5e25))
- **auth:** Add page middlewares ([3dfba09](https://github.com/becem-gharbi/nuxt-directus/commit/3dfba09))
- **auth:** Implement storage getter/setter ([52f83ff](https://github.com/becem-gharbi/nuxt-directus/commit/52f83ff))
- **auth:** Update loggedIn on page reload ([f1debcf](https://github.com/becem-gharbi/nuxt-directus/commit/f1debcf))
- **auth:** Add user state ([ec0f8ac](https://github.com/becem-gharbi/nuxt-directus/commit/ec0f8ac))

### 🩹 Fixes

- **auth:** Add authorization header when token available ([f2bea83](https://github.com/becem-gharbi/nuxt-directus/commit/f2bea83))
- **auth:** Update user state on page load ([54ded9f](https://github.com/becem-gharbi/nuxt-directus/commit/54ded9f))
- **auth:** Call refresh method on initialization ([5f03756](https://github.com/becem-gharbi/nuxt-directus/commit/5f03756))
- **auth:** Add missing imports ([c5f5b59](https://github.com/becem-gharbi/nuxt-directus/commit/c5f5b59))
- **rest:** Add client type ([45c1c43](https://github.com/becem-gharbi/nuxt-directus/commit/45c1c43))

### 💅 Refactors

- Group types under /types ([f3b3fcc](https://github.com/becem-gharbi/nuxt-directus/commit/f3b3fcc))

### 📖 Documentation

- **readme:** Update installation section ([a8967cc](https://github.com/becem-gharbi/nuxt-directus/commit/a8967cc))
- Add todos section ([1f22144](https://github.com/becem-gharbi/nuxt-directus/commit/1f22144))
- Update README.md ([b8b81da](https://github.com/becem-gharbi/nuxt-directus/commit/b8b81da))
- Update todos list ([1226128](https://github.com/becem-gharbi/nuxt-directus/commit/1226128))

### 🌊 Types

- **auth:** Add loggedIn type ([f555760](https://github.com/becem-gharbi/nuxt-directus/commit/f555760))

### 🏡 Chore

- **demo:** Install new module ([dd11fcb](https://github.com/becem-gharbi/nuxt-directus/commit/dd11fcb))
- Upgrade dependencies ([cb860f6](https://github.com/becem-gharbi/nuxt-directus/commit/cb860f6))
- **demo:** Install new module ([e7742d4](https://github.com/becem-gharbi/nuxt-directus/commit/e7742d4))
- **auth:** Check mode cookie ([efde604](https://github.com/becem-gharbi/nuxt-directus/commit/efde604))
- Disable SSR ([df3e309](https://github.com/becem-gharbi/nuxt-directus/commit/df3e309))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>
- Becem <becem.gharbi@live.com>

## v0.0.1-next

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.6...v0.0.1-next)

### 🩹 Fixes

- **deps:** Update dependency @bg-dev/nuxt-directus to v0.1.6 ([ca6bed4](https://github.com/becem-gharbi/nuxt-directus/commit/ca6bed4))

### 📖 Documentation

- **readme:** Add ext version note ([03ef8d7](https://github.com/becem-gharbi/nuxt-directus/commit/03ef8d7))
- Update installation section ([2e15860](https://github.com/becem-gharbi/nuxt-directus/commit/2e15860))

### 🏡 Chore

- Update changelog ([335e7d1](https://github.com/becem-gharbi/nuxt-directus/commit/335e7d1))
- **demo:** Upgrade dependencies ([dd96160](https://github.com/becem-gharbi/nuxt-directus/commit/dd96160))
- Rename package tag to ext ([55fa973](https://github.com/becem-gharbi/nuxt-directus/commit/55fa973))
- Remove old sdk ([1068da2](https://github.com/becem-gharbi/nuxt-directus/commit/1068da2))
- Add next suffix to version ([5eba52d](https://github.com/becem-gharbi/nuxt-directus/commit/5eba52d))
- Update changelogen versionSuffix ([ba7d21c](https://github.com/becem-gharbi/nuxt-directus/commit/ba7d21c))
- Comment old sdk related code ([92cc2ca](https://github.com/becem-gharbi/nuxt-directus/commit/92cc2ca))
- Test changelogen bump ([49bd08e](https://github.com/becem-gharbi/nuxt-directus/commit/49bd08e))

### ❤️  Contributors

- Becem Gharbi <becem.gharbi@live.com>

## v0.1.6

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.5...v0.1.6)


### 🩹 Fixes

  - **deps:** Update dependency @bg-dev/nuxt-directus to v0.1.5 ([a0d62d3](https://github.com/becem-gharbi/nuxt-directus/commit/a0d62d3))
  - **deps:** Update all non-major dependencies ([bb4551d](https://github.com/becem-gharbi/nuxt-directus/commit/bb4551d))
  - **deps:** Update nuxt 3 to v3.5.3 ([2537e30](https://github.com/becem-gharbi/nuxt-directus/commit/2537e30))
  - Fix middleware from.path to to.path([8586e22](https://github.com/becem-gharbi/nuxt-directus/commit/8586e22))

### ❤️  Contributors

- Ling - [vanling](https://github.com/vanling)

## v0.1.5

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.4...v0.1.5)


### 🩹 Fixes

  - **demo:** Update arg on loginWithProvider ([b7f1813](https://github.com/becem-gharbi/nuxt-directus/commit/b7f1813))
  - **logout:** Deleted cache of fetched data on logout ([fd25afa](https://github.com/becem-gharbi/nuxt-directus/commit/fd25afa))

### 🏡 Chore

  - **demo:** Upgrade dependencies ([d6faf44](https://github.com/becem-gharbi/nuxt-directus/commit/d6faf44))

### ❤️  Contributors

- Becem-gharbi

## v0.1.4

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.3...v0.1.4)


### 🚀 Enhancements

  - Add cutom redirect path on login ([adec1ae](https://github.com/becem-gharbi/nuxt-directus/commit/adec1ae))

### 🩹 Fixes

  - Place useRoute outside route middlewares ([381d41b](https://github.com/becem-gharbi/nuxt-directus/commit/381d41b))

### 💅 Refactors

  - Use ufo utilities for url manipulations ([1486d87](https://github.com/becem-gharbi/nuxt-directus/commit/1486d87))

### ❤️  Contributors

- Becem-gharbi

## v0.1.3

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.2...v0.1.3)


### 🩹 Fixes

  - Add missing meta data ([c6bf4a5](https://github.com/becem-gharbi/nuxt-directus/commit/c6bf4a5))

### 📖 Documentation

  - Update readme ([41d33ca](https://github.com/becem-gharbi/nuxt-directus/commit/41d33ca))
  - Display total downloads ([c7023b0](https://github.com/becem-gharbi/nuxt-directus/commit/c7023b0))

### 🏡 Chore

  - Upgrade demo app deps ([effae84](https://github.com/becem-gharbi/nuxt-directus/commit/effae84))

### ❤️  Contributors

- Becem-gharbi

## v0.1.2

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v0.1.1...v0.1.2)


### 💅 Refactors

  - Edit logger messages ([f2c45cf](https://github.com/becem-gharbi/nuxt-directus/commit/f2c45cf))

### 📖 Documentation

  - Update readme ([7c1652c](https://github.com/becem-gharbi/nuxt-directus/commit/7c1652c))

### 🏡 Chore

  - Upgrade demo app deps ([bd3f85d](https://github.com/becem-gharbi/nuxt-directus/commit/bd3f85d))

### ❤️  Contributors

- Becem-gharbi

## v0.1.1

[compare changes](https://github.com/becem-gharbi/nuxt-directus/compare/v1.0.0-beta.14...v0.1.1)


### 🔥 Performance

  - Remove qs and use native ofetch query serialization ([33c9797](https://github.com/becem-gharbi/nuxt-directus/commit/33c9797))

### 💅 Refactors

  - Remove extra logging in useDirectusAuth ([e7382a7](https://github.com/becem-gharbi/nuxt-directus/commit/e7382a7))

### 📖 Documentation

  - Add userFields module options in README ([7104b72](https://github.com/becem-gharbi/nuxt-directus/commit/7104b72))

### 🏡 Chore

  - Remove semantic-release & github workflow ([2c88138](https://github.com/becem-gharbi/nuxt-directus/commit/2c88138))

### ❤️  Contributors

- Becem-gharbi

