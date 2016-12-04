import {OpaqueToken, NgModule, ModuleWithProviders} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {BreakPoint} from './breakpoints/break-point';
import {BreakPointRegistry} from './breakpoints/break-point-registry';
import {BreakPointsProvider} from "./providers/break-points-provider";


import {MatchMedia} from './match-media';
import {MediaMonitor} from './media-monitor';
import {MatchMediaObservableProvider} from './providers/match-media-provider';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */


@NgModule({
  providers: [
    MatchMedia,                   // Low-level service to publish observables around window.matchMedia()
    MediaMonitor,                 // MediaQuery monitor service that easily observes all known breakpoints
    BreakPointRegistry,           // Registry of known/used BreakPoint(s)
    BreakPointsProvider,           // Supports developer overrides of list of known breakpoints
    MatchMediaObservableProvider  // Allows easy subscription to the injectable `media$` matchMedia observable
  ]
})
export class MediaQueriesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: MediaQueriesModule
    };
  }
}
