/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';

import {MatchMedia} from './match-media';
import {MediaMonitor} from './media-monitor';
import {ObservableMediaProvider} from './observable-media-service';
import {BreakPointsProvider} from './breakpoints/break-points';
import {BreakPointRegistry} from './breakpoints/break-point-registry';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */

@NgModule({
  providers: [
    MatchMedia,              // Low-level service to publish observables w/ window.matchMedia()
    BreakPointsProvider,     // Supports developer overrides of list of known breakpoints
    BreakPointRegistry,      // Registry of known/used BreakPoint(s)
    MediaMonitor,            // MediaQuery monitor service observes all known breakpoints
    ObservableMediaProvider  // easy subscription injectable `media$` matchMedia observable
  ]
})
export class MediaQueriesModule {
}


