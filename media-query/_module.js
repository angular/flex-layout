var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';
import { MatchMedia } from './match-media';
import { MediaMonitor } from './media-monitor';
import { OBSERVABLE_MEDIA_PROVIDER } from './observable-media-provider';
import { DEFAULT_BREAKPOINTS_PROVIDER } from './breakpoints/break-points-provider';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
var MediaQueriesModule = (function () {
    function MediaQueriesModule() {
    }
    return MediaQueriesModule;
}());
MediaQueriesModule = __decorate([
    NgModule({
        providers: [
            DEFAULT_BREAKPOINTS_PROVIDER,
            BreakPointRegistry,
            MatchMedia,
            MediaMonitor,
            OBSERVABLE_MEDIA_PROVIDER // easy subscription injectable `media$` matchMedia observable
        ]
    })
], MediaQueriesModule);
export { MediaQueriesModule };
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/media-query/_module.js.map