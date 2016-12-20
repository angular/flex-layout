import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { BreakPointRegistry } from '../breakpoints/break-point-registry';
import { MatchMedia, MatchMediaObservable } from '../match-media';
import { mergeAlias } from '../../utils/add-alias';
/**
 * This factory uses the BreakPoint Registry only to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and those
 * fields will be ''.
 *
 * !! Only activation mediaChange notifications are publised by the MatchMediaObservable
 */
export function instanceOfMatchMediaObservable(mediaWatcher, breakpoints) {
    var onlyActivations = function (change) { return change.matches === true; };
    var findBreakpoint = function (mediaQuery) { return breakpoints.findByQuery(mediaQuery); };
    var injectAlias = function (change) { return mergeAlias(change, findBreakpoint(change.mediaQuery)); };
    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
    //       these must be injected into the MediaChange
    return mediaWatcher.observe().filter(onlyActivations).map(injectAlias);
}
;
/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export var MatchMediaObservableProvider = {
    provide: MatchMediaObservable,
    deps: [MatchMedia, BreakPointRegistry],
    useFactory: instanceOfMatchMediaObservable
};
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/media-query/providers/match-media-observable-provider.js.map