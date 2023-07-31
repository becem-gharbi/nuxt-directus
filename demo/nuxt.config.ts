export default defineNuxtConfig({
  ssr: true,

  css: ["~/assets/fonts/gellix/style.css"],

  modules: [
    "@bg-dev/nuxt-directus",
    "@nuxtjs/tailwindcss",
    "@bg-dev/nuxt-naiveui",
  ],

  tailwindcss: {
    viewer: false,
  },

  vite: {
    server: {
      fs: {
        allow: ["../package"],
      },
    },
    define: {
      __DEV__: (process.env.NODE_ENV === "development").toString(),
    },
  },

  directus: {
    rest: {
      baseUrl: process.env.DIRECTUS_BASE_URL || "http://127.0.0.1:8055", // Directus app base url
      nuxtBaseUrl: process.env.BASE_URL || "http://127.0.0.1:3000", // Nuxt app base url
    },

    auth: {
      enabled: true,
      enableGlobalAuthMiddleware: false, // Enable auth middleware on every page
      redirect: {
        login: "/auth/login", // Path to redirect when login is required
        logout: "/auth/login", // Path to redirect after logout
        home: "/home", // Path to redirect after successful login
        resetPassword: "/auth/reset-password", // Path to redirect for password reset
        callback: "/auth/callback", // Path to redirect after login with provider
      },
    },

    graphql: {
      enabled: false,
    },
  },
});
