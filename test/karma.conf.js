// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const {customLaunchers, platformMap} = require('./browser-providers');

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-browserstack-launcher"),
      require('karma-firefox-launcher'),
      require("karma-sauce-launcher"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: {
      jasmine: {
        // TODO(jelbourn): re-enable random test order once we can de-flake existing issues.
        random: false,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    customLaunchers,
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    sauceLabs: {
      testName: "Angular Layout Unit Tests",
      startConnect: false,
      recordVideo: false,
      recordScreenshots: false,
      idleTimeout: 600,
      commandTimeout: 600,
      maxDuration: 5400,
    },

    browserStack: {
      project: "Angular Layout Unit Tests",
      startTunnel: true,
      retryLimit: 3,
      timeout: 1800,
      video: false,
    },

    // Try Websocket for a faster transmission first. Fallback to polling if necessary.
    transports: ["websocket", "polling"],
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,
    captureTimeout: 180000,
    browsers: ['ChromeHeadlessLocal'],
    reporters: ["progress", "kjhtml"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    restartOnFileChange: true,
  });

  if (process.env["CIRCLECI"]) {
    const containerInstanceIndex = Number(process.env["CIRCLE_NODE_INDEX"]);
    const maxParallelContainerInstances = Number(
      process.env["CIRCLE_NODE_TOTAL"]
    );
    const tunnelIdentifier = `angular-layout-${process.env["CIRCLE_BUILD_NUM"]}-${containerInstanceIndex}`;
    const buildIdentifier = `circleci-${tunnelIdentifier}`;
    const testPlatform = process.env["TEST_PLATFORM"];

    // This defines how often a given browser should be launched in the same CircleCI
    // container. This is helpful if we want to shard tests across the same browser.
    const parallelBrowserInstances =
      Number(process.env["KARMA_PARALLEL_BROWSERS"]) || 1;

    // In case there should be multiple instances of the browsers, we need to set up the
    // the karma-parallel plugin.
    if (parallelBrowserInstances > 1) {
      config.frameworks.unshift("parallel");
      config.plugins.push(require("karma-parallel"));
      config.parallelOptions = {
        executors: parallelBrowserInstances,
        shardStrategy: "round-robin",
      };
    }

    if (testPlatform === "browserstack") {
      config.browserStack.build = buildIdentifier;
      config.browserStack.tunnelIdentifier = tunnelIdentifier;
    } else if (testPlatform === "saucelabs") {
      config.sauceLabs.build = buildIdentifier;
      config.sauceLabs.tunnelIdentifier = tunnelIdentifier;
    }

    const platformBrowsers = platformMap[testPlatform];
    const browserInstanceChunks = splitBrowsersIntoInstances(
      platformBrowsers,
      maxParallelContainerInstances
    );

    // Configure Karma to launch the browsers that belong to the given test platform and
    // container instance.
    config.browsers = browserInstanceChunks[containerInstanceIndex];
  }
};

/**
 * Splits the specified browsers into a maximum amount of chunks. The chunk of browsers
 * are being created deterministically and therefore we get reproducible tests when executing
 * the same CircleCI instance multiple times.
 */
function splitBrowsersIntoInstances(browsers, maxInstances) {
  let chunks = [];
  let assignedBrowsers = 0;

  for (let i = 0; i < maxInstances; i++) {
    const chunkSize = Math.floor(
      (browsers.length - assignedBrowsers) / (maxInstances - i)
    );
    chunks[i] = browsers.slice(assignedBrowsers, assignedBrowsers + chunkSize);
    assignedBrowsers += chunkSize;
  }

  return chunks;
}
