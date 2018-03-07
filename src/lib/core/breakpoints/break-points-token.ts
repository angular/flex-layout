/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {APP_ROOT_SCOPE, InjectionToken} from '@angular/core';
import {BreakPoint} from './break-point';
import {validateSuffixes} from './breakpoint-tools';
import {DEFAULT_BREAKPOINTS} from './data/break-points';

/**
 *  Injection token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export const BREAKPOINTS =
    new InjectionToken<BreakPoint[]>('Token (@angular/flex-layout) Breakpoints', {
      scope: APP_ROOT_SCOPE,
      factory: () => validateSuffixes(DEFAULT_BREAKPOINTS)
    });
