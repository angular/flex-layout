
class BreakPointsService {

  constructor() {
    this.breakpoints = [
        new BreakPoint(''     , ''    , 'screen'                                                , 10),
        new BreakPoint('xs'   , 'Xs'  , 'screen and (max-width: 599px)'                         , 9),
        new BreakPoint('gt-xs', 'GtXs', 'screen and (min-width: 600px)'                         , 8),
        new BreakPoint('sm'   , 'Sm'  , 'screen and (min-width: 600px) and (max-width: 959px)'  , 7),
        new BreakPoint('gt-sm', 'GtSm', 'screen and (min-width: 960px)'                         , 6),
        new BreakPoint('md'   , 'Md'  , 'screen and (min-width: 960px) and (max-width: 1279px)' , 5),
        new BreakPoint('gt-md', 'GtMd', 'screen and (min-width: 1280px)'                        , 4),
        new BreakPoint('lg'   , 'Lg'  , 'screen and (min-width: 1280px) and (max-width: 1919px)', 3),
        new BreakPoint('gt-lg', 'GtLg', 'screen and (min-width: 1920px)'                        , 2),
        new BreakPoint('xl'   , 'Xl'  , 'screen and (min-width: 1920px)'                        , 1)
    ];
  }

  // ************************************************
  // Public Methods
  // ************************************************

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
  constructor( suffix, normalized, mediaQuery, order = 0 ) {

    this.suffix           = suffix;
    this.normalizedSuffix = normalized;
    this.mediaQuery       = mediaQuery;
    this.order            = order;

  }
}


// ************************************************************
// Module Export
// ************************************************************

export default BreakPointsService;
