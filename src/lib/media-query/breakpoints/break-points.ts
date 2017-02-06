/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {OpaqueToken} from '@angular/core';
import {BreakPoint} from '../breakpoints/break-point';

export const RESPONSIVE_ALIASES = [
              'xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl'
            ];

export const RAW_DEFAULTS: BreakPoint[ ] = [
  {
    alias: 'xs',
    suffix: 'Xs',
    overlapping: false,
    mediaQuery: 'screen and (max-width: 599px)'
  },
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
    mediaQuery: 'screen and (min-width: 1921px)'  // should be distinct from 'gt-lg' range
  }
];

/**
 *  Opaque Token unique to the flex-layout library.
 *  Use this token when build a custom provider (see below).
 */
export const BREAKPOINTS: OpaqueToken = new OpaqueToken('fxRawBreakpoints');

/**
 *  Provider to return observable to ALL known BreakPoint(s)
 *  Developers should build custom providers to override
 *  this default BreakPointRegistry dataset provider
 *  NOTE: !! custom breakpoints lists MUST contain the following aliases & suffixes:
 *        [xs, gt-xs, sm, gt-sm, md, gt-md, lg, gt-lg, xl]
 */
export const BreakPointsProvider = { // tslint:disable-line:variable-name
  provide: BREAKPOINTS,
  useValue: RAW_DEFAULTS
};
