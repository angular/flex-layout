import { OpaqueToken } from '@angular/core';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MatchMedia } from '../match-media';
/**
 * This factory uses the BreakPoint Registry only to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and those
 * fields will be ''.
 *
 * !! Only activation mediaChange notifications are publised by the MatchMediaObservable
 */
export declare function instanceOfMatchMediaObservable(mediaWatcher: MatchMedia, breakpoints: BreakPointRegistry): Observable<any>;
/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export declare const MatchMediaObservableProvider: {
    provide: OpaqueToken;
    deps: (typeof BreakPointRegistry | typeof MatchMedia)[];
    useFactory: (mediaWatcher: MatchMedia, breakpoints: BreakPointRegistry) => Observable<any>;
};
