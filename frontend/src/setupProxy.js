/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  const target = process.env.API_PROXY_TARGET || 'http://localhost:8000';
  app.use(
    '/api',
    createProxyMiddleware({
      target,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '/api',
      },
      onProxyReq: (proxyReq) => {
        proxyReq.setHeader('X-Dev-Proxy', 'CRA');
      },
    })
  );
};
