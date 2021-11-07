import {dest, src, task, series} from 'gulp';
import htmlmin from 'gulp-htmlmin';
import {join} from 'path';
import {composeRelease} from '../build-release';
import {inlineResourcesForDirectory} from '../inline-resources';
import {buildScssTask} from './build-scss-task';
import {watchFiles} from './watch-files';
import {BuildPackage} from '../build-package';

const htmlMinifierOptions = {
  collapseWhitespace: true,
  removeComments: true,
  caseSensitive: true,
  removeAttributeQuotes: false
};

/** Creates a set of gulp tasks that can build the specified package. */
export function createPackageBuildTasks(buildPackage: BuildPackage) {
  // Name of the package build tasks for Gulp.
  const taskName = buildPackage.name;

  // Name of all dependencies of the current package.
  const dependencyNames = buildPackage.dependencies.map(p => p.name);

  // Glob that matches all style files that need to be copied to the package output.
  const stylesGlob = join(buildPackage.sourceDir, '**/*.+(scss|css)');

  // Glob that matches every HTML file in the current package.
  const htmlGlob = join(buildPackage.sourceDir, '**/*.html');

  // List of watch tasks that need run together with the watch task of the current package.
  const dependentWatchTasks = buildPackage.dependencies.map(p => `${p.name}:watch`);

  /**
   * TypeScript compilation tasks. Tasks are creating ESM, FESM, UMD bundles for releases.
   */
  task(`${taskName}:build:esm`, () => buildPackage.compile());
  task(`${taskName}:build:esm:tests`, () => buildPackage.compileTests());

  task(`${taskName}:build:bundles`, () => buildPackage.createBundles());

  /**
   * Asset tasks. Building SASS files and inlining CSS, HTML files into the ESM output.
   */
  task(`${taskName}:assets:scss`, buildScssTask(
    buildPackage.outputDir, buildPackage.sourceDir, true)
  );

  task(`${taskName}:assets:es2015-scss`, buildScssTask(
    buildPackage.esm2015OutputDir, buildPackage.sourceDir, true)
  );

  task(`${taskName}:assets:copy-styles`, () => {
    return src(stylesGlob)
      .pipe(dest(buildPackage.outputDir))
      .pipe(dest(buildPackage.esm2015OutputDir));
  });
  task(`${taskName}:assets:html`, () => {
    return src(htmlGlob).pipe(htmlmin(htmlMinifierOptions))
      .pipe(dest(buildPackage.outputDir))
      .pipe(dest(buildPackage.esm2015OutputDir));
  });

  task(`${taskName}:assets`,
    series(
      `${taskName}:assets:scss`,
      `${taskName}:assets:es2015-scss`,
      `${taskName}:assets:copy-styles`,
      `${taskName}:assets:html`
    )
  );

  task(`${taskName}:assets:inline`, (done) => {
    inlineResourcesForDirectory(buildPackage.outputDir);
    done();
  });

  task(`${taskName}:build-no-bundles`, series(
    // Build assets before building the ESM output. Since we compile with NGC, the compiler
    // tries to resolve all required assets.
    `${taskName}:assets`,
    // Build the ESM output that includes all test files. Also build assets for the package.
    `${taskName}:build:esm:tests`,
    // Inline assets into ESM output.
    `${taskName}:assets:inline`
  ));

  task(`${taskName}:build`, series(
    // Build all required packages before building.
    ...dependencyNames.map(pkgName => `${pkgName}:build`),
    // Build ESM and assets output.
    `${taskName}:assets`,
    `${taskName}:build:esm`,
    // Inline assets into ESM output.
    `${taskName}:assets:inline`,
    // Build bundles on top of inlined ESM output.
    `${taskName}:build:bundles`,
  ));

  /**
   * Main tasks for the package building. Tasks execute the different sub-tasks in the correct
   * order.
   */
  task(`${taskName}:clean-build`, series('clean', `${taskName}:build`));

  /**
   * Release tasks for the package. Tasks compose the release output for the package.
   */

  task(`${taskName}:build-release`, series(`${taskName}:build`, (done) => {
    console.log('before');
    composeRelease(buildPackage);
    console.log('after');
    done();
  }));
  task(`${taskName}:build-release:clean`, series('clean', `${taskName}:build-release`));

  /**
   * Watch tasks, that will rebuild the package whenever TS, SCSS, or HTML files change.
   */
  task(`${taskName}:watch`,
    series(...dependentWatchTasks,
      // tslint:disable-next-line:max-line-length
      () => watchFiles(join(buildPackage.sourceDir, '**/*.+(ts|scss|html)'), [`${taskName}:build`])));
}
