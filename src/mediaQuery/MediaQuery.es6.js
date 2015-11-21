import angular           from 'angular'
import MediaQueryWatcher from 'mq/services/MediaQueryWatcher.es6'
import BreakPointsService  from 'mq/services/BreakPointsService.es6'

let mdMediaModule = angular.module('material.mediaQuery',[ ])
      .service("$mdBreakpoints", BreakPointsService )
      .service("$mdMediaWatcher" , MediaQueryWatcher );

export default mdMediaModule.name;
