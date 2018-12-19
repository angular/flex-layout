import {task} from 'gulp';
import {mkdirpSync, writeFileSync} from 'fs-extra';
import {buildConfig, composeRelease, sequenceTask} from 'lib-build-tools';
import {join} from 'path';
import {Bundler} from 'scss-bundle';
import {flexLayoutPackage} from '../packages';

const distDir = buildConfig.outputDir;
const {sourceDir} = flexLayoutPackage;

/** Path to the directory where all releases are created. */
const releasesDir = join(distDir, 'releases');

// Path to the release output of material.
const releasePath = join(releasesDir, 'flex-layout');

// Matches all SCSS files in the different packages. Note that this glob is not used to build
// the bundle. It's used to identify Sass files that shouldn't be included multiple times.
const allScssDedupeGlob = join(buildConfig.packagesDir, '**/*.scss');

// The entry-point for the scss theming bundle.
const themingEntryPointPath = join(sourceDir, 'core', 'sass', '_layout-bp.scss');

// Output path for the scss theming bundle.
const themingBundlePath = join(releasePath, '_mq.scss');

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
  ['flex-layout:build'],
  ['flex-layout:bundle-theming-scss'],
));

/** Bundles all scss requires for theming into a single scss file in the root of the package. */
task('flex-layout:bundle-theming-scss', () => {
  // Instantiates the SCSS bundler and bundles all imports of the specified entry point SCSS file.
  // A glob of all SCSS files in the library will be passed to the bundler. The bundler takes an
  // array of globs, which will match SCSS files that will be only included once in the bundle.
  return new Bundler().Bundle(themingEntryPointPath, [allScssDedupeGlob]).then(result => {
    // The release directory is not created yet because the composing of the release happens when
    // this task finishes.
    mkdirpSync(releasePath);
    writeFileSync(themingBundlePath, result.bundledContent);
  });
});
