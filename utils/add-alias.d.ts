import { MediaChange } from '../media-query/media-change';
import { BreakPoint } from '../media-query/breakpoints/break-point';
/**
 * @internal
 *
 * For the specified MediaChange, make sure it contains the breakpoint alias
 * and suffix (if available).
 */
export declare function mergeAlias(dest: MediaChange, source: BreakPoint): any;
