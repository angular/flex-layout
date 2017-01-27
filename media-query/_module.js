import { NgModule } from '@angular/core';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
import { BreakPointsProvider } from "./providers/break-points-provider";
import { MatchMedia } from './match-media';
import { MediaMonitor } from './media-monitor';
import { ObservableMediaServiceProvider } from './providers/observable-media-service-provider';
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
                        ObservableMediaServiceProvider // easy subscription injectable `media$` matchMedia observable
                    ]
                },] },
    ];
    /** @nocollapse */
    MediaQueriesModule.ctorParameters = function () { return []; };
    return MediaQueriesModule;
}());
//# sourceMappingURL=/usr/local/google/home/andrewjs/Desktop/caretaker/flex-layout/src/lib/media-query/_module.js.map