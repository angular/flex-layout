/// <reference path="../../typings/browser.d.ts" />
var media_query_watcher_1 = require('./services/media-query-watcher');
var break_points_1 = require('./services/break-points');
angular.module('material.mediaQuery', [])
    .service('$mdBreakpoints', break_points_1.BreakPointsService)
    .service('$mdBrowserMediaQueryRegistrar', media_query_watcher_1.BrowserMediaQueryRegistrar)
    .service('$mdMediaWatcher', media_query_watcher_1.MediaQueryWatcherService);
