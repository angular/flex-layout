/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {inject, InjectionToken} from '@angular/core';


/**
 * A breakpoint is a wrapper interface around the browser's mediaQuery,
 * which is a condition string used for matching based on browser window
 * parameters. Here, a breakpoint has a shortcut name, e.g. 'xs', the
 * corresponding mediaQuery, and a priority in case the mediaQuery overlaps
 * with other registered breakpoints.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries
 */
export interface Breakpoint {
  /** The shortcut name for the breakpoint, e.g. 'xs' */
  name: string;
  /** The mediaQuery for the breakpoint, e.g. 'screen and (max-width: 500px)' */
  media: string;
  /** The priority of the breakpoint compared to other breakpoints */
  priority: number;
}

export const FALLBACK_BREAKPOINT_KEY: string = '__FALLBACK__';

/**
 * The fallback breakpoint, which has no real name and is
 * superseded by any other breakpoint value
 */
export const FALLBACK_BREAKPOINT: Breakpoint = {
  name: FALLBACK_BREAKPOINT_KEY,
  media: 'all',
  priority: -Number.MAX_SAFE_INTEGER,
};

/**
 * The default breakpoints as provided by Google's Material Design.
 * These do not include orientation breakpoints or device breakpoints.
 */
export const DEFAULT_BREAKPOINTS: Breakpoint[] = [
  {
    name: 'xs',
    media: 'screen and (min-width: 0px) and (max-width: 599.9px)',
    priority: 1000,
  },
  {
    name: 'sm',
    media: 'screen and (min-width: 600px) and (max-width: 959.9px)',
    priority: 900,
  },
  {
    name: 'md',
    media: 'screen and (min-width: 960px) and (max-width: 1279.9px)',
    priority: 800,
  },
  {
    name: 'lg',
    media: 'screen and (min-width: 1280px) and (max-width: 1919.9px)',
    priority: 700,
  },
  {
    name: 'xl',
    media: 'screen and (min-width: 1920px) and (max-width: 4999.9px)',
    priority: 600,
  },
  {
    name: 'lt-sm',
    media: 'screen and (max-width: 599.9px)',
    priority: 950,
  },
  {
    name: 'lt-md',
    media: 'screen and (max-width: 959.9px)',
    priority: 850,
  },
  {
    name: 'lt-lg',
    media: 'screen and (max-width: 1279.9px)',
    priority: 750,
  },
  {
    name: 'lt-xl',
    priority: 650,
    media: 'screen and (max-width: 1919.9px)',
  },
  {
    name: 'gt-xs',
    media: 'screen and (min-width: 600px)',
    priority: -950,
  },
  {
    name: 'gt-sm',
    media: 'screen and (min-width: 960px)',
    priority: -850,
  }, {
    name: 'gt-md',
    media: 'screen and (min-width: 1280px)',
    priority: -750,
  },
  {
    name: 'gt-lg',
    media: 'screen and (min-width: 1920px)',
    priority: -650,
  }
];

/**
 * The user-facing injection token for providing breakpoints,
 * this is meant to be provided as a multi-provider, and
 * consolidated later.
 */
export const BREAKPOINTS =
  new InjectionToken<Array<Array<Breakpoint>>>('Angular Layout Breakpoints');

/** An internal-facing provider for the default breakpoints */
export const BREAKPOINTS_PROVIDER = {
  provide: BREAKPOINTS,
  useValue: DEFAULT_BREAKPOINTS,
  multi: true,
};

/**
 * An internal-facing injection token to consolidate all registered
 * breakpoints for use in the application.
 */
export const BPS = new InjectionToken<Breakpoint[]>('Angular Layout Condensed Breakpoints', {
  providedIn: 'root',
  factory: () => {
    const providedBps = inject(BREAKPOINTS);
    const bpMap: Map<string, Breakpoint> = new Map();

    providedBps.forEach(bps => {
      bps.forEach(bp => {
        bpMap.set(bp.name, bp);
      });
    });

    return [...Array.from(bpMap.values()), FALLBACK_BREAKPOINT];
  }
});
