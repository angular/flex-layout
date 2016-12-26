import { OpaqueToken } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MediaChange } from '../media-change';
import { MatchMedia } from '../match-media';
/**
 * Factory returns a simple service instance that exposes a feature to subscribe to mediaQuery
 * changes and a validator to test if a mediaQuery (or alias) is currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the MatchMediaObservable
 *
 * This factory uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and those
 * fields will be ''.
 *
 * @return Object with two (2) methods: subscribe(observer) and isActive(alias|query)
 */
export declare function MatchMediaObservableFactory(mediaWatcher: MatchMedia, breakpoints: BreakPointRegistry): {
    "subscribe": (next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void) => Subscription;
    "isActive": (alias: any) => boolean;
};
/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export declare const MatchMediaObservableProvider: {
    provide: OpaqueToken;
    deps: (typeof BreakPointRegistry | typeof MatchMedia)[];
    useFactory: (mediaWatcher: MatchMedia, breakpoints: BreakPointRegistry) => {
        "subscribe": (next?: (value: MediaChange) => void, error?: (error: any) => void, complete?: () => void) => Subscription;
        "isActive": (alias: any) => boolean;
    };
};
