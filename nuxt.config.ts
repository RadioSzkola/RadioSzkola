// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },

    devServer: {
        port: 3001,
    },

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
    ],

    css: ["~/assets/css/main.css"],
    ui: {
        colorMode: false,
    },

    hub: {
        cache: true,
        database: true,
    },
});
