/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BreakPoint } from '../media-query/breakpoints/break-point';
/**
 * For each breakpoint, ensure that a Suffix is defined;
 * fallback to UpperCamelCase the unique Alias value
 */
export declare function validateSuffixes(list: BreakPoint[]): BreakPoint[];
/**
 * Merge a custom breakpoint list with the default list based on unique alias values
 *  - Items are added if the alias is not in the default list
 *  - Items are merged with the custom override if the alias exists in the default list
 */
export declare function mergeByAlias(defaults: BreakPoint[], custom?: BreakPoint[]): BreakPoint[];
