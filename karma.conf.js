var webpackConfig = require('./webpack.config');
webpackConfig.devtool = 'eval-source-map';

module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: false,
    frameworks: ['jasmine'],
    autoWatchBatchDelay: 500,
    files: [
      'node_modules/angular/angular.js',
      'src/**/*.spec.ts'
    ],
    preprocessors: {
      'src/**/*.ts': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  });
};
