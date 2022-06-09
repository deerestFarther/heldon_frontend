module.exports = {
  devServer: {
    port: 3000,
    proxy: {//跨域处理
      '/api': {
        target: 'http://www.pandub.cn:8080/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }
}