import { NgModule } from '@angular/core';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { BreakPointsProvider } from "./providers/break-points-provider";
import { MatchMedia } from './match-media';
import { MediaMonitor } from './media-monitor';
import { MatchMediaObservableProvider } from './providers/match-media-observable-provider';
/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
export var MediaQueriesModule = (function () {
    function MediaQueriesModule() {
    }
    MediaQueriesModule.forRoot = function () {
        return {
            ngModule: MediaQueriesModule
        };
    };
    MediaQueriesModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        MatchMedia,
                        MediaMonitor,
                        BreakPointRegistry,
                        BreakPointsProvider,
                        MatchMediaObservableProvider // Allows easy subscription to the injectable `media$` matchMedia observable
                    ]
                },] },
    ];
    /** @nocollapse */
    MediaQueriesModule.ctorParameters = function () { return []; };
    return MediaQueriesModule;
}());
//# sourceMappingURL=/home/travis/build/angular/flex-layout/src/lib/media-query/_module.js.map