/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BreakPoint} from '../break-point';

/* tslint:disable */
const HANDSET_PORTRAIT  = '(orientation: portrait) and (max-width: 599px)';
const HANDSET_LANDSCAPE = '(orientation: landscape) and (max-width: 959px)';

const TABLET_LANDSCAPE  = '(orientation: landscape) and (min-width: 960px) and (max-width: 1279px)';
const TABLET_PORTRAIT   = '(orientation: portrait) and (min-width: 600px) and (max-width: 839px)';

const WEB_PORTRAIT      = '(orientation: portrait) and (min-width: 840px)';
const WEB_LANDSCAPE     = '(orientation: landscape) and (min-width: 1280px)';

export const ScreenTypes = {
  'HANDSET'           : `${HANDSET_PORTRAIT}, ${HANDSET_LANDSCAPE}`,
  'TABLET'            : `${TABLET_PORTRAIT} , ${TABLET_LANDSCAPE}`,
  'WEB'               : `${WEB_PORTRAIT}, ${WEB_LANDSCAPE} `,

  'HANDSET_PORTRAIT'  : `${HANDSET_PORTRAIT}`,
  'TABLET_PORTRAIT'   : `${TABLET_PORTRAIT} `,
  'WEB_PORTRAIT'      : `${WEB_PORTRAIT}`,

  'HANDSET_LANDSCAPE' : `${HANDSET_LANDSCAPE}]`,
  'TABLET_LANDSCAPE'  : `${TABLET_LANDSCAPE}`,
  'WEB_LANDSCAPE'     : `${WEB_LANDSCAPE}`
};

/**
 * Extended Breakpoints for handset/tablets with landscape or portrait orientations
 */
export const ORIENTATION_BREAKPOINTS : BreakPoint[] = [
  {'alias': 'handset',            priority: 10000, 'mediaQuery': ScreenTypes.HANDSET},
  {'alias': 'handset.landscape',  priority: 10000, 'mediaQuery': ScreenTypes.HANDSET_LANDSCAPE},
  {'alias': 'handset.portrait',   priority: 10000, 'mediaQuery': ScreenTypes.HANDSET_PORTRAIT},

  {'alias': 'tablet',             priority: 8000, 'mediaQuery': ScreenTypes.TABLET},
  {'alias': 'tablet.landscape',   priority: 8000, 'mediaQuery': ScreenTypes.TABLET},
  {'alias': 'tablet.portrait',    priority: 8000, 'mediaQuery': ScreenTypes.TABLET_PORTRAIT},

  {'alias': 'web',                priority: 9000, 'mediaQuery': ScreenTypes.WEB, overlapping : true },
  {'alias': 'web.landscape',      priority: 9000, 'mediaQuery': ScreenTypes.WEB_LANDSCAPE, overlapping : true },
  {'alias': 'web.portrait',       priority: 9000, 'mediaQuery': ScreenTypes.WEB_PORTRAIT, overlapping : true }
];
