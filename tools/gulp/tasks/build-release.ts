import {task} from 'gulp';
import {composeRelease, sequenceTask} from 'lib-build-tools';
import {flexLayoutPackage} from '../packages';
/**
 * Overwrite the release task for the Flex-Layout package. The Flex-Layout release
 * will include special files, like a bundled theming SCSS file or all prebuilt themes.
 */
task('flex-layout:build-release', ['flex-layout:prepare-release'], () => {
  composeRelease(flexLayoutPackage);
});

/**
 * Task that will build the Flex-Layout package. It will also copy all prebuilt themes and build
 * a bundled SCSS file for theming
 */
task('flex-layout:prepare-release', sequenceTask(
  'flex-layout:build'
));

