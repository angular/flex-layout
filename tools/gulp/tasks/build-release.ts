import {task, src, dest} from 'gulp';
import {buildConfig, composeRelease, sequenceTask} from 'lib-build-tools';
import {flexLayoutPackage} from '../packages';
import {join} from 'path';
import {tsBuildTask} from '../util/task_helpers';

const distDir = buildConfig.outputDir;
const {sourceDir} = flexLayoutPackage;
const schematicsDir = join(sourceDir, 'schematics');

/** Path to the directory where all releases are created. */
const releasesDir = join(distDir, 'releases');

// Path to the release output of flex layout.
const releasePath = join(releasesDir, 'flex-layout');


// Pattern matching schematics files to be copied into the @angular/flex-layout package.
const schematicsGlobs = [
  // File templates and schemas are copied as-is from source.
  join(schematicsDir, '**/+(data|files)/**/*'),
  join(schematicsDir, '**/+(schema|collection|migration).json'),

  // JavaScript files compiled from the TypeScript sources.
  join(distDir, 'schematics', '**/*.js?(.map)'),
];

/** Overwrite the release task for the Flex-Layout package */
task('flex-layout:build-release', ['flex-layout:prepare-release'],
  () => composeRelease(flexLayoutPackage));

/** Task that will build the Flex-Layout package */
task('flex-layout:prepare-release', sequenceTask(
  ['flex-layout:build', 'schematics:build'],
  ['flex-layout:copy-schematics'],
));

/** Compile the schematics TypeScript to JavaScript */
task('schematics:build', tsBuildTask(join(schematicsDir, 'tsconfig.json')));

task('flex-layout:copy-schematics', () => {
  return src(schematicsGlobs).pipe(dest(join(releasePath, 'schematics')));
});
