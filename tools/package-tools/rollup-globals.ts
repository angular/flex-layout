import {join} from 'path';
import {getSubdirectoryNames} from './secondary-entry-points';
import {buildConfig} from './build-config';

/** Method that converts dash-case strings to a camel-based string. */
export const dashCaseToCamelCase =
  (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

/** List of potential secondary entry-points for the material package. */
const flexLayoutSecondaryEntryPoints = getSubdirectoryNames(join(buildConfig.packagesDir, 'lib'));

/** Object with all flex layout entry points in the format of Rollup globals. */
const rollupFlexLayoutEntryPoints = flexLayoutSecondaryEntryPoints
  .reduce((globals: any, entryPoint: string) => {
    // Note that this needs to be in sync with the UMD module name format in "build-bundles.ts".
    globals[`@angular/flex-layout/${entryPoint}`] =
      `ng.flexLayout.${dashCaseToCamelCase(entryPoint)}`;
    return globals;
}, {});

/** Map of globals that are used inside of the different packages. */
export const rollupGlobals = {
  'tslib': 'tslib',

  '@angular/animations': 'ng.animations',
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',
  '@angular/common/http': 'ng.common.http',
  '@angular/forms': 'ng.forms',
  '@angular/router': 'ng.router',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-server': 'ng.platformServer',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  '@angular/core/testing': 'ng.core.testing',
  '@angular/common/testing': 'ng.common.testing',
  '@angular/common/http/testing': 'ng.common.http.testing',
  '@angular/material/button': 'ng.material.button',
  '@angular/material/select': 'ng.material.select',
  '@angular/material/form-field': 'ng.material.formField',
  '@angular/cdk/bidi': 'ng.cdk.bidi',
  '@angular/cdk/coercion': 'ng.cdk.coercion',
  '@angular/cdk/layout': 'ng.cdk.layout',
  '@angular/cdk/platform': 'ng.cdk.platform',

  // Some packages are not really needed for the UMD bundles, but for the missingRollupGlobals rule.
  // Note that this needs to be in sync with the UMD module name format in "build-bundles.ts".
  '@angular/flex-layout': 'ng.flexLayout',

  // Include secondary entry-points of the cdk and material packages
   ...rollupFlexLayoutEntryPoints,

  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators',
};
