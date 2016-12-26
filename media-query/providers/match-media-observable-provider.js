import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MatchMedia, MatchMediaObservable } from '../match-media';
import { mergeAlias } from '../../utils/add-alias';
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
export function MatchMediaObservableFactory(mediaWatcher, breakpoints) {
    /**
     * Only pass/announce activations (not de-activations)
     */
    var onlyActivations = function (change) {
        return change.matches === true;
    };
    /**
     * Inject associated (if any) alias information into the MediaChange event
     */
    var injectAlias = function (change) {
        return mergeAlias(change, findByQuery(change.mediaQuery));
    };
    /**
     * Breakpoint locator by alias
     */
    var findByAlias = function (alias) {
        return breakpoints.findByAlias(alias);
    };
    /**
     * Breakpoint locator by mediaQuery
     */
    var findByQuery = function (query) {
        return breakpoints.findByQuery(query);
    };
    /**
     * Find associated breakpoint (if any)
     */
    var toMediaQuery = function (query) {
        var bp = findByAlias(query) || findByQuery(query);
        return bp ? bp.mediaQuery : query;
    };
    /**
     * Proxy to the Observable subscribe method
     */
    var subscribe = function (next, error, complete) {
        return observable$.subscribe(next, error, complete);
    };
    /**
     * Test if specified query/alias is active.
     */
    var isActive = function (alias) {
        return mediaWatcher.isActive(toMediaQuery(alias));
    };
    // Register all the mediaQueries registered in the BreakPointRegistry
    // This is needed so subscribers can be auto-notified of all standard, registered mediaQuery activations
    breakpoints.items.forEach(function (bp) { return mediaWatcher.observe(bp.mediaQuery); });
    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
    //       these must be injected into the MediaChange
    var observable$ = mediaWatcher.observe().filter(onlyActivations).map(injectAlias);
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
export var MatchMediaObservableProvider = {
    provide: MatchMediaObservable,
    deps: [MatchMedia, BreakPointRegistry],
    useFactory: MatchMediaObservableFactory
};
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/media-query/providers/match-media-observable-provider.js.map