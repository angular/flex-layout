import { OpaqueToken } from '@angular/core';
import { BreakPoint } from '../breakpoints/break-point';
export declare const RESPONSIVE_ALIASES: string[];
export declare const RAW_DEFAULTS: BreakPoint[];
/**
 *  Opaque Token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export declare const BREAKPOINTS: OpaqueToken;
/**
 *  Provider to return observable to ALL known BreakPoint(s)
 *  Developers should build custom providers to override this default BreakPointRegistry dataset provider
 *  NOTE: !! custom breakpoints lists MUST contain the following aliases & suffixes:
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
export declare const BreakPointsProvider: {
    provide: OpaqueToken;
    useValue: BreakPoint[];
};
