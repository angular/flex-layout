import {task, watch} from 'gulp';
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
const rollup = require('rollup').rollup;
const uglify = require('rollup-plugin-uglify');

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

/** Builds components to ESM output and UMD bundle. */
task('build:lib', [':build:lib:rollup']);

// INTERNAL tasks

/** [Watch task] Rebuilds for tests (CJS output) whenever ts, scss, or html sources change. */
task(':watch:lib:spec', () => {
  watch(path.join(libDir, '**/*.ts'), [':build:lib:spec']);
});

/** Builds components typescript for tests (with CommonJS output). */
task(':build:lib:spec', tsBuildTask(libSpecDir, 'tsconfig-spec.json'));


/** Copies assets (html, markdown) to build output. */
task(':build:lib:assets', copyTask([
  path.join(NPM_ASSETS, 'package.json'),
  path.join(NPM_ASSETS, 'README.md'),
  path.join(PROJECT_ROOT, 'LICENSE')
], DIST_COMPONENTS_ROOT));

/**
 * Builds component typescript only (ESM output).
 */
task(':build:lib:ts', tsBuildTask(libDir, 'tsconfig.json'));

/**
 * Rollup components to 'output' defined in 'tsconfig.json'
 */
task(':build:lib:rollup', [':build:lib:inline'], doRollupWith(DIST_COMPONENTS_ROOT));

/** Builds components with resources (html, css) inlined into the built JS (ESM output). */
task(':build:lib:inline', sequenceTask(
  [':build:lib:ts', ':build:lib:assets'],
  ':inline-resources',
));

/** Inlines resources (html, css) into the JS output (for either ESM or CJS output). */
task(':inline-resources', () => inlineResources(DIST_COMPONENTS_ROOT));

/** Generates metadata.json files for all of the components. */
task(':build:lib:ngc', ['build:lib'], execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', tsconfigPath]
));

function doRollupWith(rootPath) {
  return () => {
    const includePathOptions = {
        paths: ['./flexbox', './media-query', './utils'],
    };
  const globals: {[name: string]: string} = {
    // Angular dependencies
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',

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

    // Rollup the @angular/flex-layout UMD bundle from all ES5 + imports JavaScript files built.
    //
    // Note: `gulp build:lib` deploys to `/node_modules/@angular/flex-layout`
    //        see tsconfig-srcs.json#L17

    return rollup({
      entry: path.join(rootPath, 'index.js'),
      context: 'this',
      external: Object.keys(globals),
      plugins: [
        // uglify()
      ]
    }).then((bundle: { generate: any }) => {
      const result = bundle.generate({
        moduleName: 'flexLayouts',
        format: 'umd',
        globals,
        sourceMap: true,
        dest: path.join(rootPath, 'flex-layout.umd.js')
      });

      // Add source map URL to the code.
      result.code += '\n\n//# sourceMappingURL=./flex-layout.umd.js.map\n';
      // Format mapping to show properly in the browser. Rollup by default will put the path
      // as relative to the file, and since that path is in src/lib and the file is in
      // dist/@angular/layouts, we need to kill a few `../`.
      result.map.sources = result.map.sources.map((s: string) => s.replace(/^(\.\.\/)+/, ''));

      writeFileSync(path.join(rootPath, 'flex-layout.umd.js'), result.code, 'utf8');
      writeFileSync(path.join(rootPath, 'flex-layout.umd.js.map'), result.map, 'utf8');
    });
  };
}
