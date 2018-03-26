/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken, Optional, SkipSelf} from '@angular/core';

import {BreakPointRegistry} from './break-point-registry';
import {BreakPoint} from './break-point';
import {BREAKPOINTS} from './break-points-token';

/**
 * Ensure a single global service provider
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export function BREAKPOINT_REGISTRY_PROVIDER_FACTORY(parentRegistry: BreakPointRegistry,
                                                     breakpoints: BreakPoint[]) {
  return parentRegistry || new BreakPointRegistry(breakpoints);
}


/**
 * Export provider that uses a global service factory (above)
 * @deprecated
 * @deletion-target v6.0.0-beta.16
 */
export const BREAKPOINT_REGISTRY_PROVIDER = {
  provide: BreakPointRegistry,
  deps: [
    [new Optional(), new SkipSelf(), BreakPointRegistry],
    <InjectionToken<BreakPoint[]>>BREAKPOINTS,
  ],
  useFactory: BREAKPOINT_REGISTRY_PROVIDER_FACTORY
};
