const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new WorkboxWebpackPlugin.InjectManifest({
          swSrc: './src/custom-service-worker.js',
          swDest: 'service-worker.js',
        })
      );
      return webpackConfig;
    },
  },
};
