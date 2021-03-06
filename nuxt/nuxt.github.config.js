import colors from 'vuetify/es5/util/colors'


export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  router: {
    base: '/json-magic/'
  },
  env: {
    baseUrl: process.env.BASE_URL || "http://localhost:3000"
  },
  serverMiddleware: ["~/api"],
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [

  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/pwa',

    "@nuxtjs/axios",
  ],

  manifest: {
    name: 'JSON Magic',
    lang: 'en',
    "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"

  },
  axios: {
    // proxyHeaders: false
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  render: {
    // 'default-src 'none'; script-src http: https: 'unsafe-inline'; style-src http: https: 'unsafe-inline' ;
    // img-src http: https: data:; font-src http: https:; connect-src http: https:; media-src http: https:; object-src 'none'; child-src 'none'; frame-src 'none''.
    csp: {
        hashAlgorithm: 'sha256',
        policies: {
          'default-src' : [
            'none'
          ],
          'script-src': [
            'unsafe-inline'
          ],
          'style-src': [
            'unsafe-inline'
          ],
          'style-src': [
            'example.com',
          ],
          'img-src': [
            'example.com',
            'data:',
            'www.gravatar.com'
          ],
          'object-src':[
            'none'
          ],
          'child-src':[
            'none'
          ],
          'frame-src':[
            'none'
          ],
          'report-uri': ['https://example.com/report-csp-violations']
        },
        addMeta: true, // Adds the meta tag to HTML
        showResult: true, // Displays the generated CSP string in the console
        saveResult: 'csp_header.txt', // Saves the CSP HTTP Header in this file in the output folder (/dist by default)
    },
},
  // render: {
  //   csp: {
  //     reportOnly: true,
  //     hashAlgorithm: 'sha256',
  //     policies: {
  //       'script-src': ["'self'"],
  //       'unsafe-eval': ["object-src 'self'"]
  //     }
  //   }
  // },
  // "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */

  build: {
    options: {
      fix: true
    },
    extend(config, { isClient }) {
      if (isClient) {
        config.optimization.splitChunks = false
      }
    }
  },
  eslint: {
    fix: true
  }

}
