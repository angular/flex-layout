
import {MediaChange} from '../media-query/media-change';
import {BreakPoint} from '../media-query/breakpoints/break-point';
import {extendObject} from './object-extend';

import {RESPONSIVE_ALIASES} from '../media-query/providers/break-points-provider';

/**
 * @internal
 *
 * For the selector, build:
 * 1) default, non-responsive attribute selector
 * 2) list of attribute selectors which contain the responsive aliases as selector
 *    with property chains
 * e.g.   ' [fx-layout], [fx-layout.xs], [fx-layout.gt-xs], [fx-layout.sm], ... '
 */
export function addResponsiveAliases(attr:string, aliases?:string[]):string {
   return (aliases || RESPONSIVE_ALIASES).reduce((all, suffix) => {
    return `${all},[${attr}.${suffix}]`;
   }, `[${attr}]`);
}

/**
 * @internal
 *
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export function  mergeAlias(dest:MediaChange, source:BreakPoint) {
  return extendObject( dest, source ? {
    mqAlias: source.alias,
    suffix:source.suffix
  } : { } );
}
