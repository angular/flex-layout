import {MediaChange} from '../media-query/media-change';
import {BreakPoint} from '../media-query/breakpoints/break-point';
import {extendObject} from './object-extend';

/**
 * @internal
 *
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export function mergeAlias(dest: MediaChange, source: BreakPoint) {
  return extendObject(dest, source ? {
        mqAlias: source.alias,
        suffix: source.suffix
      } : {});
}
