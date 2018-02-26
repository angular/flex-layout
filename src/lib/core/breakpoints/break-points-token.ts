/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {InjectionToken} from '@angular/core';
import {BreakPoint} from './break-point';

/**
 *  Injection token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export const BREAKPOINTS =
    new InjectionToken<BreakPoint[]>('Token (@angular/flex-layout) Breakpoints');
