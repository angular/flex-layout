/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';
import {BreakPoint} from '../breakpoints/break-point';

export const BREAKPOINT = new InjectionToken<BreakPoint|BreakPoint[]|null>(
  'Flex Layout token, collect all breakpoints into one provider', {
    providedIn: 'root',
    factory: () => null
  });
