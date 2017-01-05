import {NgModule, ModuleWithProviders} from '@angular/core';

import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {BreakPointsProvider} from "./providers/break-points-provider";


import {MatchMedia} from './match-media';
import {MediaMonitor} from './media-monitor';
import {MatchMediaObservableProvider} from './providers/match-media-observable-provider';

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
    MatchMediaObservableProvider  // easy subscription injectable `media$` matchMedia observable
  ]
})
export class MediaQueriesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaQueriesModule
    };
  }
}
