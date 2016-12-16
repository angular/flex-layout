import {OpaqueToken} from '@angular/core';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';

import {BreakPointRegistry} from '../breakpoints/break-point-registry';

import {MediaChange} from '../media-change';
import {MatchMedia} from '../match-media';
import {mergeAlias} from '../../utils/add-alias';
import {BreakPoint} from '../breakpoints/break-point';

/**
 *  Opaque Token unique to the flex-layout library.
 *  Note: Developers must use this token when building their own custom `MatchMediaObservableProvider`
 *  provider (see below).
 */
export const MatchMediaObservable: OpaqueToken = new OpaqueToken('fx-observable-media-query');

export function instanceOfMatchMediaObservable(mediaWatcher: MatchMedia, breakpoints: BreakPointRegistry) {
    let onlyActivations = function(change : MediaChange) { return change.matches === true };
    let findBreakpoint = function(mediaQuery:string):BreakPoint { return breakpoints.findByQuery(mediaQuery); };
    let injectAlias = function(change : MediaChange) { return mergeAlias(change, findBreakpoint(change.mediaQuery)); };

    // Note: the raw MediaChange events [from MatchMedia] do not contain important alias information
    //       these must be injected into the MediaChange
    return mediaWatcher.observe( ).filter( onlyActivations ).map( injectAlias );
};

/**
 *  Provider to return observable to ALL MediaQuery events
 *  Developers should build custom providers to override this default MediaQuery Observable
 */
export const MatchMediaObservableProvider = {
  provide: MatchMediaObservable,
  deps: [MatchMedia, BreakPointRegistry],
  useFactory: instanceOfMatchMediaObservable
};
