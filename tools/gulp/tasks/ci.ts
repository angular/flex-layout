import {task} from 'gulp';


task('ci:lint', ['lint']);

// Travis sometimes does not exit the process and times out. This is to prevent that.
task('ci:test', ['test:single-run'], () => process.exit(0));

/** Task to verify that all components work with AOT compilation. */
task('ci:aot', ['aot:build']);

/** Task that verifies if all Flex-layout components are working with platform-server.*/
task('ci:prerender', ['prerender']);

/** Task which reports the size of the library and stores it in a database. */
task('ci:payload', ['payload']);

task('ci:ssr', ['test:ssr']);



