/// <reference path="../../typings/browser.d.ts" />

import { MediaQueryWatcherService, BrowserMediaQueryRegistrar } from './services/media-query-watcher';
import { BreakPointsService }  from './services/break-points';

angular.module('material.mediaQuery', [])
  .service('$mdBreakpoints', BreakPointsService )
  .service('$mdBrowserMediaQueryRegistrar', BrowserMediaQueryRegistrar )
  .service('$mdMediaWatcher', MediaQueryWatcherService );
