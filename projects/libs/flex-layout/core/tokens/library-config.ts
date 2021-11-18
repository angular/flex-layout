/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';

/** a set of configuration options for FlexLayoutModule */
export interface LayoutConfigOptions {
  addFlexToParent?: boolean;
  addOrientationBps?: boolean;
  disableDefaultBps?: boolean;
  disableVendorPrefixes?: boolean;
  serverLoaded?: boolean;
  useColumnBasisZero?: boolean;
  printWithBreakpoints?: string[];
  mediaTriggerAutoRestore?: boolean;
  ssrObserveBreakpoints?: string[];
}

export const DEFAULT_CONFIG: LayoutConfigOptions = {
  addFlexToParent: true,
  addOrientationBps: false,
  disableDefaultBps: false,
  disableVendorPrefixes: false,
  serverLoaded: false,
  useColumnBasisZero: true,
  printWithBreakpoints: [],
  mediaTriggerAutoRestore: true,
  ssrObserveBreakpoints: [],
};

export const LAYOUT_CONFIG = new InjectionToken<LayoutConfigOptions>(
    'Flex Layout token, config options for the library', {
      providedIn: 'root',
      factory: () => DEFAULT_CONFIG
    });
