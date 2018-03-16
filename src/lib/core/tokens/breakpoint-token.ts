/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {InjectionToken} from '@angular/core';
import {BreakPoint} from '../breakpoints/break-point';

export const DISABLE_DEFAULT_BREAKPOINTS = new InjectionToken<boolean>(
  'Flex Layout token, disable the default breakpoints');

export const ADD_ORIENTATION_BREAKPOINTS = new InjectionToken<boolean>(
  'Flex Layout token, add the orientation breakpoints');

export const BREAKPOINT = new InjectionToken<BreakPoint|BreakPoint[]>(
  'Flex Layout token, collect all breakpoints into one provider');
