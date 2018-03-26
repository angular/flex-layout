/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken, Optional, SkipSelf} from '@angular/core';

import {BreakPoint} from './break-point';
import {BREAKPOINTS} from './break-points-token';
import {DEFAULT_BREAKPOINTS} from './data/break-points';
import {ORIENTATION_BREAKPOINTS} from './data/orientation-break-points';
import {mergeByAlias} from './breakpoint-tools';
import {
  ADD_ORIENTATION_BREAKPOINTS,
  BREAKPOINT,
  DISABLE_DEFAULT_BREAKPOINTS,
} from '../tokens/breakpoint-token';

/**
 * Factory that combines the configured breakpoints into one array and then merges
 * them using a utility function
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export function BREAKPOINTS_PROVIDER_FACTORY(parentBreakpoints: BreakPoint[],
                                             breakpoints: (BreakPoint|BreakPoint[])[],
                                             disableDefaults: boolean,
                                             addOrientation: boolean) {
  const bpFlattenArray = [].concat.apply([], (breakpoints || [])
    .map(v => Array.isArray(v) ? v : [v]));
  const builtIns = DEFAULT_BREAKPOINTS.concat(addOrientation ? ORIENTATION_BREAKPOINTS : []);
  return parentBreakpoints || disableDefaults ?
     mergeByAlias(bpFlattenArray) : mergeByAlias(builtIns, bpFlattenArray);
}

/**
 * Provider that combines the provided extra breakpoints with the default and
 * orientation breakpoints based on configuration
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export const BREAKPOINTS_PROVIDER = {
  provide: <InjectionToken<BreakPoint[]>>BREAKPOINTS,
  useFactory: BREAKPOINTS_PROVIDER_FACTORY,
  deps: [
    [new Optional(), new SkipSelf(), BREAKPOINTS],
    [new Optional(), BREAKPOINT],
    [new Optional(), DISABLE_DEFAULT_BREAKPOINTS],
    [new Optional(), ADD_ORIENTATION_BREAKPOINTS],
  ]
};
