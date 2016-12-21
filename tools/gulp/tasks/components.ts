import {task, watch, src, dest} from 'gulp';
import * as path from 'path';

import {
  PROJECT_ROOT,
  SOURCE_ROOT, TEST_ROOT,
  DIST_COMPONENTS_ROOT,
  DIST_NODE_MODULES,
  NPM_ASSETS } from '../constants';
import {tsBuildTask, execNodeTask, copyTask, sequenceTask} from '../task_helpers';
import {writeFileSync} from 'fs';

// No typings for these.
const inlineResources = require('../../scripts/release/inline-resources');
const gulpRollup = require('gulp-better-rollup');

// NOTE: there are two build "modes" in this file, based on which tsconfig is used.
//
// 1) `tsconfig.json`: we are outputting ES6 modules and a UMD bundle. This is used
// for serving and for release.
//
// 2) `tsconfig-spec.json`: we are outputting CommonJS modules. This is used
// for unit tests (karma).

/** Path to the root of the @Angular/flex-layout library. */
/** Path to the tsconfig used for ESM output. */
const libDir = path.join(SOURCE_ROOT, 'lib');
const libSpecDir = path.join(SOURCE_ROOT, 'lib');
const tsconfigPath = "./" + path.relative(PROJECT_ROOT, path.join(libDir, 'tsconfig.json'));


// PUBLIC tasks

// INTERNAL tasks

/** [Watch task] Rebuilds for tests (CJS output) whenever ts, scss, or html sources change. */
task(':watch:components:spec', () => {
  watch(path.join(libDir, '**/*.ts'), [':build:components:spec']);
});

/** Builds components typescript for tests (with CommonJS output). */
task(':build:components:spec', tsBuildTask(libSpecDir, 'tsconfig-spec.json'));


/** Copies assets (html, markdown) to build output. */
task(':build:components:assets', copyTask([
  path.join(NPM_ASSETS, 'package.json'),
  path.join(NPM_ASSETS, 'README.md'),
  path.join(PROJECT_ROOT, 'LICENSE')
], DIST_COMPONENTS_ROOT));

/**
 * Builds component typescript only (ESM output).
 */
task(':build:components:ts', tsBuildTask(libDir, 'tsconfig.json'));

/** Builds components with resources (html, css) inlined into the built JS (ESM output). */
task(':build:components:inline', sequenceTask(
  [':build:components:ts', ':build:components:assets'],
  ':inline-resources',
));

/** Inlines resources (html, css) into the JS output (for either ESM or CJS output). */
task(':inline-resources', () => inlineResources(DIST_COMPONENTS_ROOT));


/** Generates metadata.json files for all of the components. */
task(':build:components:ngc', ['build:components'], execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', tsconfigPath]
));

/** Builds components to ESM output and UMD bundle. */
task('build:components', sequenceTask(':build:components:inline', ':build:components:rollup'));


/** Builds the UMD bundle for all of Angular Material. */
task(':build:components:rollup', () => {
    const globals: {[name: string]: string} = {
      // Angular dependencies
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      '@angular/platform-browser': 'ng.platformBrowser',
      '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',

      // Rxjs dependencies
      'rxjs/Subject': 'Rx',
      'rxjs/Subscription': 'Rx',
      'rxjs/BehaviorSubject': 'Rx',
      'rxjs/Observable': 'Rx',
      'rxjs/add/observable/forkJoin': 'Rx.Observable',
      'rxjs/add/observable/of': 'Rx.Observable',
      'rxjs/add/operator/toPromise': 'Rx.Observable.prototype',
      'rxjs/add/operator/map': 'Rx.Observable.prototype',
      'rxjs/add/operator/filter': 'Rx.Observable.prototype',
      'rxjs/add/operator/do': 'Rx.Observable.prototype',
      'rxjs/add/operator/share': 'Rx.Observable.prototype',
      'rxjs/add/operator/finally': 'Rx.Observable.prototype',
      'rxjs/add/operator/catch': 'Rx.Observable.prototype'
    };

    const rollupOptions = {
      context: 'this',
      external: Object.keys(globals)
    };

    const rollupGenerateOptions = {
      // Keep the moduleId empty because we don't want to force developers to a specific moduleId.
      moduleId: '',
      moduleName: 'ng.flexLayout',
      format: 'umd',
      globals,
      dest: 'flex-layout.umd.js'
    };

    return src(path.join(DIST_COMPONENTS_ROOT, 'index.js'))
      .pipe(gulpRollup(rollupOptions, rollupGenerateOptions))
      .pipe(dest(path.join(DIST_COMPONENTS_ROOT, 'bundles')));
  });
