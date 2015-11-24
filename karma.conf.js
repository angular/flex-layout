// Karma configuration
// Generated on Sun Nov 22 2015 12:04:16 GMT-0600 (CST)

module.exports = function(config) {
  config.set({

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files to exclude
    exclude: [ ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    browsers: [ 'Chrome' ],

    plugins: [
      require('karma-chrome-launcher'),
      require('karma-jasmine'),
      require('karma-traceur-preprocessor')
    ],

    preprocessors: {
          '**/*.es6.js': ['traceur'],
          '**/*.spec.js': ['traceur']
        },

    // list of files / patterns to load in the browser
    files: [
      'jspm_packages/github/angular/bower-angular@1.4.8.js',
      'jspm_packages/npm/angular-mocks@1.4.8.js',
      'src/**/*.es6.js',
      'test/**/*.spec.js'
    ],

    traceurPreprocessor: {
      options: {
        sourceMaps: true,
        modules: 'inline'
      }
    }

  });
};
