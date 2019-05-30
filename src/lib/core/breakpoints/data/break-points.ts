/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {BreakPoint} from '../break-point';

/**
 * NOTE: Smaller ranges have HIGHER priority since the match is more specific
 */
export const DEFAULT_BREAKPOINTS: BreakPoint[] = [
  {
    alias: 'xs',
    mediaQuery: 'screen and (min-width: 0px) and (max-width: 599.9px)',
    priority: 1000,
  },
  {
    alias: 'sm',
    mediaQuery: 'screen and (min-width: 600px) and (max-width: 959.9px)',
    priority: 900,
  },
  {
    alias: 'md',
    mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279.9px)',
    priority: 800,
  },
  {
    alias: 'lg',
    mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919.9px)',
    priority: 700,
  },
  {
    alias: 'xl',
    mediaQuery: 'screen and (min-width: 1920px) and (max-width: 4999.9px)',
    priority: 600,
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 599.9px)',
    priority: 950,
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 959.9px)',
    priority: 850,
  },
  {
    alias: 'lt-lg',
    overlapping: true,
    mediaQuery: 'screen and (max-width: 1279.9px)',
    priority: 750,
  },
  {
    alias: 'lt-xl',
    overlapping: true,
    priority: 650,
    mediaQuery: 'screen and (max-width: 1919.9px)',
  },
  {
    alias: 'gt-xs',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 600px)',
    priority: -950,
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 960px)',
    priority: -850,
  }, {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1280px)',
    priority: -750,
  },
  {
    alias: 'gt-lg',
    overlapping: true,
    mediaQuery: 'screen and (min-width: 1920px)',
    priority: -650,
  }
];

