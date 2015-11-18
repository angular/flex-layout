
class BreakPointsService {

  constructor() {
    this.breakpoints = [
        new BreakPoint(''      ,''     ,'screen'                                                ),
        new BreakPoint('xs'    ,'Xs'   ,'screen and (max-width: 479px)'                         ),
        new BreakPoint('gt-xs' ,'GtXs' ,'screen and (min-width: 480px)'                         ),
        new BreakPoint('sm'    ,'Sm'   ,'screen and (max-width: 599px)'                         ),
        new BreakPoint('gt-sm' ,'GtSm' ,'screen and (min-width: 600px)'                         ),
        new BreakPoint('md'    ,'Md'   ,'screen and (min-width: 600px) and (max-width: 959px)'  ),
        new BreakPoint('gt-md' ,'GtMd' ,'screen and (min-width: 960px)'                         ),
        new BreakPoint('lg'    ,'Lg'   ,'screen and (min-width: 960px) and (max-width: 1279px)' ),
        new BreakPoint('gt-lg' ,'GtLg' ,'screen and (min-width: 1280px)'                        ),
        new BreakPoint('xl'    ,'Xl'   ,'screen and (min-width: 1280px) and (max-width: 1599px)'),
        new BreakPoint('gt-xl' ,'GtXl' ,'screen and (min-width: 1600px)'                        )
    ];
  }

  /**
   * Search registered breakpoints for matching suffix
   */
  findBreakpointBy(alias) {
    let breakpoint = null;
    angular.forEach(this.breakpoints, (it)=> {
      if (it.suffix === alias) {
        breakpoint = it;
      }
    });
    return breakpoint;
  }

}

class BreakPoint {
  constructor( suffix, normalized, mediaQuery ) {

    this.suffix           = suffix;
    this.normalizedSuffix = normalized;
    this.mediaQuery       = mediaQuery;

  }
}

export default BreakPointsService;
