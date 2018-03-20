import {join} from 'path';
import {task, watch} from 'gulp';
import {buildConfig, sequenceTask} from 'lib-build-tools';

// There are no type definitions available for these imports.
const runSequence = require('run-sequence');

const {packagesDir, projectDir} = buildConfig;

/** Builds everything that is necessary for karma. */
task(':test:build', sequenceTask(
  'clean',
  // Build ESM output of Flex-Layout that also includes all test files.
  'flex-layout:build-no-bundles',
));

/**
 * Runs the unit tests. Does not watch for changes.
 * This task should be used when running tests on the CI server.
 */
task('test:single-run', [':test:build'], (done: () => void) => {
  // Load karma not outside. Karma pollutes Promise with a different implementation.
  let karma = require('karma');

  new karma.Server({
    configFile: join(projectDir, 'test/karma.conf.js'),
    singleRun: true
  }, (exitCode: number) => {
    // Immediately exit the process if Karma reported errors, because due to
    // potential still running tunnel-browsers gulp won't exit properly.
    exitCode === 0 ? done() : process.exit(exitCode);
  }).start();
});

/**
 * [Watch task] Runs the unit tests, rebuilding and re-testing when sources change.
 * Does not inline resources. Note that this doesn't use Karma's built-in file
 * watching. Due to the way our build process is set up, Karma ends up firing
 * it's change detection for every file that is written to disk, which causes
 * it to run tests multiple time and makes it hard to follow the console output.
 * This approach runs the Karma server and then depends on the Gulp API to tell
 * Karma when to run the tests.
 *
 * This task should be used when running unit tests locally.
 */
task('test', [':test:build'], () => {
  let patternRoot = join(packagesDir, 'lib', '**/*');
  // Load karma not outside. Karma pollutes Promise with a different implementation.
  let karma = require('karma');

  // Configure the Karma server and override the autoWatch and singleRun just in case.
  let server = new karma.Server({
    configFile: join(projectDir, 'test/karma.conf.js'),
    autoWatch: false,
    singleRun: false
  });

  // Refreshes Karma's file list and schedules a test run.
  // Tests will only run if TypeScript compilation was successful.
  let runTests = (err?: Error) => {
    if (!err) {
      server.refreshFiles().then(() => server._injector.get('executor').schedule());
    }
  };

  // Boot up the test server and run the tests whenever a new browser connects.
  server.start();
  server.on('browser_register', () => runTests());

  // Whenever a file change has been recognized, rebuild and re-run the tests.
  watch(patternRoot + '.+(ts|scss|html)', () => runSequence(':test:build', runTests));
});
