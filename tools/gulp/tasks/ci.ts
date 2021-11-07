import {series, task} from 'gulp';


task('ci:lint', series('lint'));

// Travis sometimes does not exit the process and times out. This is to prevent that.
task('ci:test', series('test:single-run', () => process.exit(0)));

/** Task to verify that all components work with AOT compilation. */
task('ci:aot', series('aot:build'));

/** Task to verify that Flex Layout works under minimal conditions without regression. */
task('ci:hw', series('hw:build'));

/** Task that verifies if all Flex-layout components are working with platform-server.*/
task('ci:prerender', series('prerender'));

task('ci:ssr', series('test:ssr'));

/** Task that builds all release packages. */
task('ci:build-release-packages', series(
  'clean',
  'flex-layout:build-release'
));



