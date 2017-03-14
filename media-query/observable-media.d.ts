import { Subscription } from 'rxjs/Subscription';
import { Observable, Subscribable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { MediaChange } from './media-change';
import { MatchMedia } from './match-media';
/**
 * Base class for MediaService and pseudo-token for
 */
export declare abstract class ObservableMedia implements Subscribable<MediaChange> {
    abstract isActive(query: string): boolean;
    abstract asObservable(): Observable<MediaChange>;
    abstract subscribe(next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void): Subscription;
}
/**
 * Class internalizes a MatchMedia service and exposes an Subscribable and Observable interface.

 * This an Observable with that exposes a feature to subscribe to mediaQuery
 * changes and a validator method (`isActive(<alias>)`) to test if a mediaQuery (or alias) is
 * currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the ObservableMedia
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * !! This is not an actual Observable. It is a wrapper of an Observable used to publish additional
 * methods like `isActive(<alias>). To access the Observable and use RxJS operators, use
 * `.asObservable()` with syntax like media.asObservable().map(....).
 *
 *  @usage
 *
 *  // RxJS
 *  import 'rxjs/add/operator/filter';
 *  import { ObservableMedia } from '@angular/flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status : string = '';
 *
 *    constructor(  media:ObservableMedia ) {
 *      let onChange = (change:MediaChange) => {
 *        this.status = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
 *      };
 *
 *      // Subscribe directly or access observable to use filter/map operators
 *      // e.g.
 *      //      media.subscribe(onChange);
 *
 *      media.asObservable()
 *        .filter((change:MediaChange) => true)   // silly noop filter
 *        .subscribe(onChange);
 *    }
 *  }
 */
export declare class MediaService implements ObservableMedia {
    private mediaWatcher;
    private breakpoints;
    /**
     * Should we announce gt-<xxx> breakpoint activations ?
     */
    filterOverlaps: boolean;
    constructor(mediaWatcher: MatchMedia, breakpoints: BreakPointRegistry);
    /**
     * Test if specified query/alias is active.
     */
    isActive(alias: any): boolean;
    /**
     * Proxy to the Observable subscribe method
     */
    subscribe(next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void): Subscription;
    /**
     * Access to observable for use with operators like
     * .filter(), .map(), etc.
     */
    asObservable(): Observable<MediaChange>;
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    private _registerBreakPoints();
    /**
     * Prepare internal observable
     * NOTE: the raw MediaChange events [from MatchMedia] do not contain important alias information
     * these must be injected into the MediaChange
     */
    private _buildObservable();
    /**
     * Breakpoint locator by alias
     */
    private _findByAlias(alias);
    /**
     * Breakpoint locator by mediaQuery
     */
    private _findByQuery(query);
    /**
     * Find associated breakpoint (if any)
     */
    private _toMediaQuery(query);
    private observable$;
}
