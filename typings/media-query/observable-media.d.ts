import { Subscription } from 'rxjs/Subscription';
import { Observable, Subscribable } from 'rxjs/Observable';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MediaChange } from './media-change';
import { MatchMedia } from './match-media';
export declare abstract class ObservableMedia implements Subscribable<MediaChange> {
    abstract isActive(query: string): boolean;
    abstract asObservable(): Observable<MediaChange>;
    abstract subscribe(next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void): Subscription;
}
export declare class MediaService implements ObservableMedia {
    private breakpoints;
    private mediaWatcher;
    filterOverlaps: boolean;
    constructor(breakpoints: BreakPointRegistry, mediaWatcher: MatchMedia);
    isActive(alias: any): boolean;
    subscribe(next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    asObservable(): Observable<MediaChange>;
    private _registerBreakPoints();
    private _buildObservable();
    private _findByAlias(alias);
    private _findByQuery(query);
    private _toMediaQuery(query);
    private observable$;
}
