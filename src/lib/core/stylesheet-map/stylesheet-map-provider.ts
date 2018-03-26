/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Optional, SkipSelf} from '@angular/core';

import {StylesheetMap} from './stylesheet-map';

/**
 * Ensure a single global service provider
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export function STYLESHEET_MAP_PROVIDER_FACTORY(parentSheet: StylesheetMap) {
  return parentSheet || new StylesheetMap();
}


/**
 * Export provider that uses a global service factory (above)
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export const STYLESHEET_MAP_PROVIDER = {
  provide: StylesheetMap,
  deps: [
    [new Optional(), new SkipSelf(), StylesheetMap],
  ],
  useFactory: STYLESHEET_MAP_PROVIDER_FACTORY
};
