import {OpaqueToken} from '@angular/core'; // tslint:disable-line:no-unused-variable

import {Subscription} from 'rxjs/Subscription';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {BreakPointRegistry} from '../breakpoints/break-point-registry';

import {MediaChange} from '../media-change';
import {MatchMedia, MatchMediaObservable} from '../match-media';
import {mergeAlias} from '../../utils/add-alias';
import {BreakPoint} from '../breakpoints/break-point';


/**
 * Factory returns a simple service instance that exposes a feature to subscribe to mediaQuery
 * changes and a validator to test if a mediaQuery (or alias) is currently active.
 *
 * !! Only mediaChange activations (not de-activations) are announced by the MatchMediaObservable
 *
 * This factory uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * @return Object with two (2) methods: subscribe(observer) and isActive(alias|query)
 */
export function MatchMediaObservableFactory(
  mediaWatcher: MatchMedia,
  breakpoints: BreakPointRegistry) {
    /**
     * Only pass/announce activations (not de-activations)
     */
    const onlyActivations = function (change: MediaChange) {
      return change.matches === true;
    };
    /**
     * Inject associated (if any) alias information into the MediaChange event
     */
    const injectAlias = function (change: MediaChange) {
      return mergeAlias(change, findByQuery(change.mediaQuery));
    };
    /**
     * Breakpoint locator by alias
     */
    const findByAlias = function (alias) {
      return breakpoints.findByAlias(alias);
    };
    /**
     * Breakpoint locator by mediaQuery
     */
    const findByQuery = function (query) {
      return breakpoints.findByQuery(query);
    };
    /**
     * Find associated breakpoint (if any)
     */
    const toMediaQuery = function (query) {
      let bp: BreakPoint = findByAlias(query) || findByQuery(query);
      return bp ? bp.mediaQuery : query;
    };
    /**
     * Proxy to the Observable subscribe method
     */
    const subscribe = function (next?: (value: MediaChange) => void,
                                error?: (error: any) => void,
                                complete?: () => void): Subscription {
      return observable$.subscribe(next, error, complete);
    };
    /**
     * Test if specified query/alias is active.
     */
    const isActive = function (alias): boolean {
      return mediaWatcher.isActive(toMediaQuery(alias));
    };

    // Register all the mediaQueries registered in the BreakPointRegistry
    // This is needed so subscribers can be auto-notified of all standard, registered
    // mediaQuery activations
    breakpoints.items.forEach((bp: BreakPoint) => mediaWatcher.observe(bp.mediaQuery));

    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
    //       these must be injected into the MediaChange
    const observable$: Observable<MediaChange> = mediaWatcher.observe()
            .filter(onlyActivations).map(injectAlias);

    // Publish service
    return {
      "subscribe": subscribe,
      "isActive": isActive
    };
}

/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export const MatchMediaObservableProvider = { // tslint:disable-line:variable-name
  provide: MatchMediaObservable,
  deps: [MatchMedia, BreakPointRegistry],
  useFactory: MatchMediaObservableFactory
};
