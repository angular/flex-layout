import { NgModule } from '@angular/core';
import { MatchMedia } from './match-media';
import { MediaMonitor } from './media-monitor';
import { ObservableMediaProvider } from './observable-media-service';
import { BreakPointsProvider } from './breakpoints/break-points';
import { BreakPointRegistry } from './breakpoints/break-point-registry';
/**
 * *****************************************************************
 * Define module for the MediaQuery API
 * *****************************************************************
 */
export var MediaQueriesModule = (function () {
    function MediaQueriesModule() {
    }
    MediaQueriesModule.decorators = [
        { type: NgModule, args: [{
                    providers: [
                        MatchMedia,
                        BreakPointsProvider,
                        BreakPointRegistry,
                        MediaMonitor,
                        ObservableMediaProvider // easy subscription injectable `media$` matchMedia observable
                    ]
                },] },
    ];
    /** @nocollapse */
    MediaQueriesModule.ctorParameters = function () { return []; };
    return MediaQueriesModule;
}());
//# sourceMappingURL=/usr/local/google/home/mmalerba/flex-layout/src/lib/media-query/_module.js.map