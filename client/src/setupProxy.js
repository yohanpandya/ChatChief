const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  console.log("setupProxy initiated")
  app.use(
    '/profile',
    createProxyMiddleware({
      target: 'https://chatchief.onrender.com' ,
      changeOrigin: true,
    })
  );
};
