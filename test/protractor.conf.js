const path = require('path');

// Load ts-node to be able to execute TypeScript files with protractor.
require('ts-node').register({
  project: path.join(__dirname, '../e2e/')
});

const E2E_BASE_URL = process.env['E2E_BASE_URL'] || 'http://localhost:4200';

exports.config = {
  useAllAngular2AppRoots: true,
  specs: [ path.join(__dirname, '../e2e/**/*.spec.ts') ],
  baseUrl: E2E_BASE_URL,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000,
  },

  plugins: [
    {
      // Runs the axe-core accessibility checks each time the e2e page changes and
      // Angular is ready.
      path: '../tools/axe-protractor/axe-protractor.js',

      rules: [

        // Disable color contrast checks since the final colors will vary based on the theme.
        { id: 'color-contrast', enabled: false },
      ]
    }
  ],

  capabilities: {
    browserName: 'chrome',

    chromeOptions: {
      args: [ '--headless', '--window-size=1024,768']
    },

    // Enables concurrent testing in the Webdriver. Currently runs three e2e files in parallel.
    shardTestFiles: true,
    maxInstances: 5,
  }
};
