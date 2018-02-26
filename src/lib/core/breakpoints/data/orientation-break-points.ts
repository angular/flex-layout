/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {BreakPoint} from '../break-point';

/* tslint:disable */
const HANDSET_PORTRAIT  = '(orientations: portrait) and (max-width: 599px)';
const HANDSET_LANDSCAPE = '(orientations: landscape) and (max-width: 959px)';

const TABLET_LANDSCAPE  = '(orientations: landscape) and (min-width: 960px) and (max-width: 1279px)';
const TABLET_PORTRAIT   = '(orientations: portrait) and (min-width: 600px) and (max-width: 839px)';

const WEB_PORTRAIT      = '(orientations: portrait) and (min-width: 840px)';
const WEB_LANDSCAPE     = '(orientations: landscape) and (min-width: 1280px)';

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
  {'alias': 'handset',            'mediaQuery': ScreenTypes.HANDSET},
  {'alias': 'handset.landscape',  'mediaQuery': ScreenTypes.HANDSET_LANDSCAPE},
  {'alias': 'handset.portrait',   'mediaQuery': ScreenTypes.HANDSET_PORTRAIT},

  {'alias': 'tablet',             'mediaQuery': ScreenTypes.TABLET},
  {'alias': 'tablet.landscape',   'mediaQuery': ScreenTypes.TABLET},
  {'alias': 'tablet.portrait',    'mediaQuery': ScreenTypes.TABLET_PORTRAIT},

  {'alias': 'web',                'mediaQuery': ScreenTypes.WEB, overlapping : true },
  {'alias': 'web.landscape',      'mediaQuery': ScreenTypes.WEB_LANDSCAPE, overlapping : true },
  {'alias': 'web.portrait',       'mediaQuery': ScreenTypes.WEB_PORTRAIT, overlapping : true }
];
