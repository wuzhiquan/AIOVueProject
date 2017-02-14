// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/mhome.jsp'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: '/static',
    assetsPublicPath: '/mobile',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: '8088',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    //  使用http-proxy-middleware中间件代理请求到AIO后台，处理跨域的问题(开发时使用)
    proxyTable: {
      '/api': {
        target: 'http://192.168.0.115:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/MobileAjax': {
        target: 'http://139.129.25.211:8801',
        // target: 'http://192.168.0.121:8080',
        changeOrigin: true
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
