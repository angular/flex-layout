import {join} from 'path';
import {getSubdirectoryNames} from './secondary-entry-points';
import {buildConfig} from './build-config';

/** Method that converts dash-case strings to a camel-based string. */
const dashCaseToCamelCase = (str: string) => str.replace(
    /-([a-z])/g,
    (g) => g[1].toUpperCase());

/** List of potential secondary entry-points for the material package. */
const flexLayoutSecondaryEntryPoints = getSubdirectoryNames(join(buildConfig.packagesDir, 'lib'));

/** Object with all material entry points in the format of Rollup globals. */
const rollupFlexLayoutEntryPoints = flexLayoutSecondaryEntryPoints
    .reduce((globals: any, entryPoint: string) => {
      const val = `ng.flex-layout.${dashCaseToCamelCase(entryPoint)}`;
      globals[`@angular/flex-layout/${entryPoint}`] = val;
      return globals;
    }, {});

/** Map of globals that are used inside of the different packages. */
export const rollupGlobals = {
  'tslib': 'tslib',

  '@angular/animations': 'ng.animations',
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/forms': 'ng.forms',
  '@angular/http': 'ng.http',
  '@angular/router': 'ng.router',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-server': 'ng.platformServer',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  '@angular/core/testing': 'ng.core.testing',
  '@angular/common/testing': 'ng.common.testing',
  '@angular/http/testing': 'ng.http.testing',
  '@angular/material': 'ng.material',
  '@angular/cdk': 'ng.cdk',

  '@angular/flex-layout': 'ng.flex-layout',

  // Some packages are not really needed for the UMD bundles, but for the missingRollupGlobals rule.
  // TODO(devversion): remove by adding minimatch and better globbing to rules
   ...rollupFlexLayoutEntryPoints,

  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subscriber': 'Rx',
  'rxjs/Scheduler': 'Rx',
  'rxjs/ReplaySubject': 'Rx',
  'rxjs/observable/combineLatest': 'Rx.Observable',
  'rxjs/observable/forkJoin': 'Rx.Observable',
  'rxjs/observable/fromEvent': 'Rx.Observable',
  'rxjs/observable/merge': 'Rx.Observable',
  'rxjs/observable/of': 'Rx.Observable',
  'rxjs/observable/throw': 'Rx.Observable',
  'rxjs/observable/defer': 'Rx.Observable',
  'rxjs/operators': 'Rx.Observable',
  'rxjs/operators/index': 'Rx.Observable',

  'rxjs/add/observable/merge': 'Rx.Observable',
  'rxjs/add/observable/fromEvent': 'Rx.Observable',
  'rxjs/add/observable/of': 'Rx.Observable',
  'rxjs/add/observable/interval': 'Rx.Observable',
  'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/debounceTime': 'Rx.Observable.prototype',
  'rxjs/add/operator/distinctUntilChanged': 'Rx.Observable.prototype',
  'rxjs/add/operator/first': 'Rx.Observable.prototype',
  'rxjs/add/operator/catch': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype'
};
