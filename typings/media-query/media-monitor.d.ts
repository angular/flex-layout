import { BreakPoint } from './breakpoints/break-point';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MatchMedia } from './match-media';
import { MediaChange } from './media-change';
import { Observable } from 'rxjs/Observable';
export declare class MediaMonitor {
    private _breakpoints;
    private _matchMedia;
    constructor(_breakpoints: BreakPointRegistry, _matchMedia: MatchMedia);
    readonly breakpoints: BreakPoint[];
    readonly activeOverlaps: BreakPoint[];
    readonly active: BreakPoint;
    isActive(alias: string): boolean;
    observe(alias?: string): Observable<MediaChange>;
    private _registerBreakpoints();
}
