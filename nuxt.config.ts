// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  plugins: [
    '~/plugins/auth.js'
  ],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      reverbAppKey: process.env.NUXT_PUBLIC_REVERB_APP_KEY,
      reverbHost: process.env.NUXT_PUBLIC_REVERB_HOST,
      reverbPort: process.env.NUXT_PUBLIC_REVERB_PORT,
      reverbScheme: process.env.NUXT_PUBLIC_REVERB_SCHEME,
    }
  },
  modules: ['@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light'
  }
})
