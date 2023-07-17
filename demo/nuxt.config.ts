// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["~/assets/fonts/gellix/style.css"],

  modules: [
    "@bg-dev/nuxt-directus",
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
  ],

  tailwindcss: {
    viewer: false,
  },

  directus: {
    baseUrl: process.env.NUXT_DIRECTUS_BASE_URL || "http://127.0.0.1:8055", // Directus app base url
    nuxtBaseUrl: process.env.NUXT_BASE_URL || "http://127.0.0.1:3000", // Nuxt app base url
    auth: {
      enabled: true,
      enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
      refreshTokenCookieName: "directus_refresh_token",
      defaultRoleId:
        process.env.NUXT_DIRECTUS_DEFAULT_ROLE_ID ||
        "271daf4d-db38-477d-bdd1-412117e1a5c0", // Role id assigned for new registered users
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
