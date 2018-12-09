import {task} from 'gulp';
import {sequenceTask} from 'lib-build-tools';


task('ci:lint', ['lint']);

// Travis sometimes does not exit the process and times out. This is to prevent that.
task('ci:test', ['test:single-run'], () => process.exit(0));

/** Task to verify that all components work with AOT compilation. */
task('ci:aot', ['aot:build']);

/** Task to verify that Flex Layout works under minimal conditions without regression. */
task('ci:hw', ['hw:build']);

/** Task that verifies if all Flex-layout components are working with platform-server.*/
task('ci:prerender', ['prerender']);

task('ci:ssr', ['test:ssr']);

/** Task that builds all release packages. */
task('ci:build-release-packages', sequenceTask(
  'clean',
  'flex-layout:build-release'
));



