export interface BreakPoint {
  suffix: string;
  normalized: string;
  mediaQuery: string;
  order: number;
}

export class BreakPointsService {
  public breakpoints: BreakPoint[];

  constructor() {
    this.breakpoints = [
      { suffix: ''     , normalized: ''    , mediaQuery: 'screen'                                                , order:  10 },
      { suffix: 'xs'   , normalized: 'Xs'  , mediaQuery: 'screen and (max-width: 599px)'                         , order: 9 },
      { suffix: 'gt-xs', normalized: 'GtXs', mediaQuery: 'screen and (min-width: 600px)'                         , order: 8 },
      { suffix: 'sm'   , normalized: 'Sm'  , mediaQuery: 'screen and (min-width: 600px) and (max-width: 959px)'  , order: 7 },
      { suffix: 'gt-sm', normalized: 'GtSm', mediaQuery: 'screen and (min-width: 960px)'                         , order: 6 },
      { suffix: 'md'   , normalized: 'Md'  , mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279px)' , order: 5 },
      { suffix: 'gt-md', normalized: 'GtMd', mediaQuery: 'screen and (min-width: 1280px)'                        , order: 4 },
      { suffix: 'lg'   , normalized: 'Lg'  , mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919px)', order: 3 },
      { suffix: 'gt-lg', normalized: 'GtLg', mediaQuery: 'screen and (min-width: 1920px)'                        , order: 2 },
      { suffix: 'xl'   , normalized: 'Xl'  , mediaQuery: 'screen and (min-width: 1920px)'                        , order: 1 }
    ];
  }

  findBreakpointBy(alias: string): BreakPoint {
    for (let bp of this.breakpoints) {
      if (bp.suffix == alias) {
        return bp;
      }
    }
    return null;
  }
}

