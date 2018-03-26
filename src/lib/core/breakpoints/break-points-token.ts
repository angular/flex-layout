/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {inject, InjectionToken} from '@angular/core';
import {BreakPoint} from './break-point';
import {
  ADD_ORIENTATION_BREAKPOINTS,
  BREAKPOINT,
  DISABLE_DEFAULT_BREAKPOINTS,
} from '../tokens/breakpoint-token';
import {DEFAULT_BREAKPOINTS} from '../breakpoints/data/break-points';
import {ORIENTATION_BREAKPOINTS} from '../breakpoints/data/orientation-break-points';
import {mergeByAlias} from '../breakpoints/breakpoint-tools';

/**
 *  Injection token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export const BREAKPOINTS =
  new InjectionToken<BreakPoint[]>('Token (@angular/flex-layout) Breakpoints', {
    providedIn: 'root',
    factory: () => {
      const breakpoints: any = inject(BREAKPOINT);
      const disableDefaults = inject(DISABLE_DEFAULT_BREAKPOINTS);
      const addOrientation = inject(ADD_ORIENTATION_BREAKPOINTS);
      const bpFlattenArray = [].concat.apply([], (breakpoints || [])
        .map(v => Array.isArray(v) ? v : [v]));
      const builtIns = DEFAULT_BREAKPOINTS.concat(addOrientation ? ORIENTATION_BREAKPOINTS : []);
      return disableDefaults ?
        mergeByAlias(bpFlattenArray) : mergeByAlias(builtIns, bpFlattenArray);
    }
  });
