import {Injectable} from '@angular/core';

export interface BreakPoint {
  mediaQuery: string;
  overlapping: boolean;
  suffix: string;
  alias: string;
}

/**
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overriden from custom, application-specific ranges
 *
 */
@Injectable()
export class BreakPoints {
  public registry: Array<BreakPoint>;

  /**
   *
   */
  constructor() {
    this.registry = [
      {alias: '', suffix: '', overlapping: true, mediaQuery: 'screen'},
      {alias: 'xs', suffix: 'Xs', overlapping: false, mediaQuery: 'screen and (max-width: 599px)'},
      {
        alias: 'gt-xs',
        suffix: 'GtXs',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 600px)'
      },
      {
        alias: 'sm',
        suffix: 'Sm',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 600px) and (max-width: 959px)'
      },
      {
        alias: 'gt-sm',
        suffix: 'GtSm',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 960px)'
      },
      {
        alias: 'md',
        suffix: 'Md',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279px)'
      },
      {
        alias: 'gt-md',
        suffix: 'GtMd',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 1280px)'
      },
      {
        alias: 'lg',
        suffix: 'Lg',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919px)'
      },
      {
        alias: 'gt-lg',
        suffix: 'GtLg',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 1920px)'
      },
      {
        alias: 'xl',
        suffix: 'Xl',
        overlapping: false,
        mediaQuery: 'screen and (min-width: 1920px)'
      }
    ];
  }

  /**
   *
   */
  findBreakpointBy(alias: string): BreakPoint {
    for (let bp of this.registry) {
      if (bp.alias == alias) {
        return bp;
      }
    }
    return null;
  }

  /**
   * Get all the breakpoints whose ranges could overlapping `normal` ranges;
   * e.g. gt-sm overlaps md, lg, and xl
   */
  get overlappings(): Array<BreakPoint> {
    return this.registry.filter(it => it.overlapping == true);
  }

  /**
   * Get list of all registered (non-empty) breakpoint aliases
   */
  get aliases(): Array<string> {
    return this.registry.map(it => it.alias);
  }

  /**
   *
   */
  get suffixes(): Array<string> {
    return this.registry.map(it => it.suffix);
  }
}
