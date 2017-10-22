/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {MediaChange} from '../media-query/media-change';
import {BreakPoint} from '../media-query/breakpoints/break-point';
import {extendObject} from './object-extend';

/**
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export function mergeAlias(dest: MediaChange, source: BreakPoint | null) {
  return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
      } : {});
}
