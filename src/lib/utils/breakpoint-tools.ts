/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BreakPoint} from '../media-query/breakpoints/break-point';
import {extendObject} from './object-extend';

const ALIAS_DELIMITERS = /(\.|-|_)/g;
function firstUpperCase(part: string) {
  let first = part.length > 0 ? part.charAt(0) : '';
  let remainder = (part.length > 1) ? part.slice(1) : '';
  return first.toUpperCase() + remainder;
}

/**
 * Converts snake-case to SnakeCase.
 * @param name Text to UpperCamelCase
 */
function camelCase(name: string): string {
  return name
      .replace(ALIAS_DELIMITERS, '|')
      .split('|')
      .map(firstUpperCase)
      .join('');
}

/**
 * For each breakpoint, ensure that a Suffix is defined;
 * fallback to UpperCamelCase the unique Alias value
 */
export function validateSuffixes(list: BreakPoint[]): BreakPoint[] {
  list.forEach((bp: BreakPoint) => {
    if (!bp.suffix || bp.suffix === '') {
      bp.suffix = camelCase(bp.alias);          // create Suffix value based on alias
      bp.overlapping = bp.overlapping || false; // ensure default value
    }
  });
  return list;
}

/**
 * Merge a custom breakpoint list with the default list based on unique alias values
 *  - Items are added if the alias is not in the default list
 *  - Items are merged with the custom override if the alias exists in the default list
 */
export function mergeByAlias(defaults: BreakPoint[], custom: BreakPoint[] = []): BreakPoint[] {
  const merged = defaults.map((bp) => extendObject({}, bp));
  const findByAlias = (alias) => merged.reduce((result, bp) => {
    return result || (( bp.alias === alias) ? bp : null);
  }, null);

  // Merge custom breakpoints
  custom.forEach((bp: BreakPoint) => {
    let target = findByAlias(bp.alias);
    if (target) {
      extendObject(target, bp);
    } else {
      merged.push(bp);
    }
  });

  return validateSuffixes(merged);
}

