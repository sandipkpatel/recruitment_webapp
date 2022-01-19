var path = require('path')
module.exports = {
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BACKENDPOINT
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src/'),
        '@component': path.resolve(__dirname, 'src/components/'),
        '@plugins': path.resolve(__dirname, 'src/plugins/'),
        '@router': path.resolve(__dirname, 'src/router/'),
        '@public': path.resolve(__dirname, 'public/'),
      }
    },
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/frontend/'
    : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
