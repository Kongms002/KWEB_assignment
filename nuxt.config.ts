// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  runtimeConfig: {
    public: {
      api_url: process.env.VITE_API_URL,
    },
  },
  

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  imports: {
    dirs: ['./stores']
  },


})
