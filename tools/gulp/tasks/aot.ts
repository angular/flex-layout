import {task} from 'gulp';
import {copySync} from 'fs-extra';
import {execNodeTask} from '../util/task_helpers';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'lib-build-tools';

const {outputDir, packagesDir} = buildConfig;

/** Path to the directory where all releases are living. */
const releasesDir = join(outputDir, 'releases');

/** Path to the demo-app source directory. */
const demoAppSource = join(packagesDir, 'demo-app');

/** Path to the demo-app output directory. */
const demoAppOut = join(outputDir, 'packages', 'demo-app');

/** Path to the tsconfig file that builds the AOT files. */
const tsconfigFile = join(demoAppOut, 'tsconfig-aot.json');

/** Builds the demo-app and flex-layout. To be able to run NGC, apply the metadata workaround. */
task('aot:deps', sequenceTask(
    'build:devapp',
    ['flex-layout:build-release'],
    'aot:copy-devapp',
    'aot:copy-release'
));

// As a workaround for https://github.com/angular/angular/issues/12249, we need to
// copy the Flex-Layout output inside of the demo-app output.
task('aot:copy-release', () => {
  copySync(join(releasesDir, 'flex-layout'), join(demoAppOut, 'flex-layout'));
});

// As a workaround for https://github.com/angular/angular/issues/12249, we need to
// copy the demo-app sources to distribution and run the NGC inside of the dist folder.
task('aot:copy-devapp', () => copySync(demoAppSource, demoAppOut));

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:build', sequenceTask('clean', 'aot:deps', 'aot:compiler-cli'));

/** Build the demo-app and a release to confirm that the library is AOT-compatible. */
task('aot:compiler-cli', execNodeTask(
    '@angular/compiler-cli', 'ngc', ['-p', tsconfigFile]
));
