module.exports = {
  devServer: {
    port: 3000,
    proxy: {//跨域处理
      '/api': {
        target: 'http://116.62.36.50:8080/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }
}