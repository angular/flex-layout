/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {inject, InjectionToken} from '@angular/core';
import {BreakPoint} from './break-point';
import {BREAKPOINT} from '../tokens/breakpoint-token';
import {DEFAULT_BREAKPOINTS} from '../breakpoints/data/break-points';
import {ORIENTATION_BREAKPOINTS} from '../breakpoints/data/orientation-break-points';
import {mergeByAlias} from '../breakpoints/breakpoint-tools';
import {LAYOUT_CONFIG} from '../tokens/library-config';

/**
 *  Injection token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export const BREAKPOINTS =
  new InjectionToken<BreakPoint[]>('Token (@angular/flex-layout) Breakpoints', {
    providedIn: 'root',
    factory: () => {
      const breakpoints: any = inject(BREAKPOINT);
      const layoutConfig = inject(LAYOUT_CONFIG);
      const bpFlattenArray: BreakPoint[] = [].concat.apply([], (breakpoints || [])
        .map((v: BreakPoint | BreakPoint[]) => Array.isArray(v) ? v : [v]));
      const builtIns = (layoutConfig.disableDefaultBps ? [] : DEFAULT_BREAKPOINTS)
        .concat(layoutConfig.addOrientationBps ? ORIENTATION_BREAKPOINTS : []);

      return mergeByAlias(builtIns, bpFlattenArray);
    }
  });
