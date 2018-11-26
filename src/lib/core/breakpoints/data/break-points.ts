/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {BreakPoint} from '../break-point';

export const RESPONSIVE_ALIASES = [
  'xs', 'gt-xs', 'sm', 'gt-sm', 'md', 'gt-md', 'lg', 'gt-lg', 'xl'
];

export const DEFAULT_BREAKPOINTS: BreakPoint[] = [
  {
    alias: 'xs',
    mediaQuery: '(min-width: 0px) and (max-width: 599px)',
    priority: 100,
  },
  {
    alias: 'gt-xs',
    overlapping: true,
    mediaQuery: '(min-width: 600px)',
    priority: 7,
  },
  {
    alias: 'lt-sm',
    overlapping: true,
    mediaQuery: '(max-width: 599px)',
    priority: 10,
  },
  {
    alias: 'sm',
    mediaQuery: '(min-width: 600px) and (max-width: 959px)',
    priority: 100,
  },
  {
    alias: 'gt-sm',
    overlapping: true,
    mediaQuery: '(min-width: 960px)',
    priority: 8,
  },
  {
    alias: 'lt-md',
    overlapping: true,
    mediaQuery: '(max-width: 959px)',
    priority: 9,
  },
  {
    alias: 'md',
    mediaQuery: '(min-width: 960px) and (max-width: 1279px)',
    priority: 100,
  },
  {
    alias: 'gt-md',
    overlapping: true,
    mediaQuery: '(min-width: 1280px)',
    priority: 9,
  },
  {
    alias: 'lt-lg',
    overlapping: true,
    mediaQuery: '(max-width: 1279px)',
    priority: 8,
  },
  {
    alias: 'lg',
    mediaQuery: '(min-width: 1280px) and (max-width: 1919px)',
    priority: 100,
  },
  {
    alias: 'gt-lg',
    overlapping: true,
    mediaQuery: '(min-width: 1920px)',
    priority: 10,
  },
  {
    alias: 'lt-xl',
    overlapping: true,
    mediaQuery: '(max-width: 1919px)',
    priority: 7,
  },
  {
    alias: 'xl',
    mediaQuery: '(min-width: 1920px) and (max-width: 5000px)',
    priority: 100,
  }
];

