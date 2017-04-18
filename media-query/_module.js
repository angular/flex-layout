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
export { MediaQueriesModule };
MediaQueriesModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    DEFAULT_BREAKPOINTS_PROVIDER,
                    BreakPointRegistry,
                    MatchMedia,
                    MediaMonitor,
                    OBSERVABLE_MEDIA_PROVIDER // easy subscription injectable `media$` matchMedia observable
                ]
            },] },
];
/** @nocollapse */
MediaQueriesModule.ctorParameters = function () { return []; };
//# sourceMappingURL=_module.js.map