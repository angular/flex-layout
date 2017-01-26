/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule, ModuleWithProviders} from '@angular/core';

import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {BreakPointsProvider} from "./providers/break-points-provider";


import {MatchMedia} from './match-media';
import {MediaMonitor} from './media-monitor';
import {ObservableMediaServiceProvider} from './providers/observable-media-service-provider';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */

@NgModule({
  providers: [
    MatchMedia,                   // Low-level service to publish observables w/ window.matchMedia()
    MediaMonitor,                 // MediaQuery monitor service observes all known breakpoints
    BreakPointRegistry,           // Registry of known/used BreakPoint(s)
    BreakPointsProvider,           // Supports developer overrides of list of known breakpoints
    ObservableMediaServiceProvider  // easy subscription injectable `media$` matchMedia observable
  ]
})
export class MediaQueriesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaQueriesModule
    };
  }
}
