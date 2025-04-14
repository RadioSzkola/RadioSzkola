// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  modules: [
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "@nuxt/ui",
    "@nuxt/test-utils",
    "@nuxt/image",
    "@nuxt/scripts",
    "nuxt-auth-utils",
    "@nuxthub/core",
    "nuxt-umami",
  ],

  css: ["~/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  hub: {
    cache: true,
    database: true,
  },
  runtimeConfig: {
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_REDIRECT_URI,
    public: {
      spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    },
  },

  umami: {
    id: "077a553a-cf3c-4309-935b-1477af26c8ef",
    host: "https://cloud.umami.is",
  },

  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
