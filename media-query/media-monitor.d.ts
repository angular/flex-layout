import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { BreakPoint } from './breakpoints/break-point';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MatchMedia } from './match-media';
import { MediaChange } from './media-change';
/**
 * MediaMonitor uses the MatchMedia service to observe mediaQuery changes (both activations and
 * deactivations). These changes are are published as MediaChange notifications.
 *
 * Note: all notifications will be performed within the
 * ng Zone to trigger change detections and component updates.
 *
 * It is the MediaMonitor that:
 *  - auto registers all known breakpoints
 *  - injects alias information into each raw MediaChange event
 *  - provides accessor to the currently active BreakPoint
 *  - publish list of overlapping BreakPoint(s); used by ResponsiveActivation
 */
export declare class MediaMonitor {
    private _breakpoints;
    private _matchMedia;
    constructor(_breakpoints: BreakPointRegistry, _matchMedia: MatchMedia);
    /**
     * Read-only accessor to the list of breakpoints configured in the BreakPointRegistry provider
     */
    readonly breakpoints: BreakPoint[];
    readonly activeOverlaps: BreakPoint[];
    readonly active: BreakPoint;
    /**
     * For the specified mediaQuery alias, is the mediaQuery range active?
     */
    isActive(alias: string): boolean;
    /**
     * External observers can watch for all (or a specific) mql changes.
     * If specific breakpoint is observed, only return *activated* events
     * otherwise return all events for BOTH activated + deactivated changes.
     */
    observe(alias?: string): Observable<MediaChange>;
    /**
     * Immediate calls to matchMedia() to establish listeners
     * and prepare for immediate subscription notifications
     */
    private _registerBreakpoints();
}
