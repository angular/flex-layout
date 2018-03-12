/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NgModule} from '@angular/core';

import {MediaMonitor} from './media-monitor/media-monitor';
import {BreakPointRegistry} from './breakpoints/break-point-registry';

import {OBSERVABLE_MEDIA_PROVIDER} from './observable-media/observable-media-provider';
import {DEFAULT_BREAKPOINTS_PROVIDER} from './breakpoints/break-points-provider';
import {MATCH_MEDIA_PROVIDER} from './match-media/match-media-provider';
import {BROWSER_PROVIDER} from './browser-provider';
import {StyleUtils} from './style-utils/style-utils';
import {STYLESHEET_MAP_PROVIDER} from './stylesheet-map/stylesheet-map-provider';

/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */

@NgModule({
  providers: [
    DEFAULT_BREAKPOINTS_PROVIDER,  // Supports developer overrides of list of known breakpoints
    BreakPointRegistry,      // Registry of known/used BreakPoint(s)
    MATCH_MEDIA_PROVIDER,    // Low-level service to publish observables w/ window.matchMedia()
    MediaMonitor,            // MediaQuery monitor service observes all known breakpoints
    OBSERVABLE_MEDIA_PROVIDER,  // easy subscription injectable `media$` matchMedia observable]
    STYLESHEET_MAP_PROVIDER,
    StyleUtils,
    BROWSER_PROVIDER,
  ]
})
export class CoreModule {
}
