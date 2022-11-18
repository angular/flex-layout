'use strict';

/*
 * Browser Configuration for the different jobs in the CI.
 *
 *   - local: Launches the browser locally on the current operating system.
 *   - BS: Launches the browser within BrowserStack
 *   - SL: Launches the browser within Saucelabs
 */
const browserConfig = {
  'ChromeHeadlessCI':  { unitTest: {target: 'local', }},
  'FirefoxHeadless':   { unitTest: {target: 'local', }},
  'iOS15': {unitTest: {target: 'saucelabs'}},
  'Safari15': {unitTest: {target: 'browserstack'}}
};

/** Exports all available custom Karma browsers. */
exports.customLaunchers = require('./karma-browsers.json');

/** Exports a map of configured browsers, which should run in the given platform. */
exports.platformMap = {
  'saucelabs': buildConfiguration('unitTest', 'saucelabs'),
  'browserstack': buildConfiguration('unitTest', 'browserstack'),
  'local': buildConfiguration('unitTest', 'local'),
};

/** Build a list of configuration (custom launcher names). */
function buildConfiguration(type, target) {
  const targetBrowsers = Object.keys(browserConfig)
    .map(browserName => [browserName, browserConfig[browserName][type]])
    .filter(([, config]) => config.target === target)
    .map(([browserName]) => browserName);

  // For browsers that run locally, the browser name shouldn't be prefixed with the target
  // platform. We only prefix the external platforms in order to distinguish between
  // local and remote browsers in our "customLaunchers" for Karma.
  if (target === 'local') {
    return targetBrowsers;
  }

  return targetBrowsers.map(browserName => {
    return `${target.toUpperCase()}_${browserName.toUpperCase()}`;
  });
}
