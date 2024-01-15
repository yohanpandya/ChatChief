const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  console.log("setupProxy initiated")
  app.use(
    '/profile',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    })
  );
};
