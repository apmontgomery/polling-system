const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  env: {
    simpleApi: process.env.SIMPLE_API || 'http://localhost:60000/simple/v1/cjdh1zc4x00040166ffqq0fgc'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },

  /*
  ** Global CSS
  */
  css: [
    {src: '~/assets/css/style.scss',
    lang: 'sass'}
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    // '~/plugins/buefy'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // '@nuxtjs/apollo'
  ],

  /*
  ** apollo module options
  */
  // apollo: {
  //   clientConfigs: {
  //     default: '~/apollo/client-configs/default.js'
  //   }
  // },

  generate: {
    routes: [
      '/1',
      '/2',
      '/3',
      '/4',
      '/5'
    ]
  },

  /*
  ** Build configuration
  */
  build: {
    postcss: {
      plugins: {
        'postcss-custom-properties': false
      }
    },
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      })
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
