/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Renderer2} from '@angular/core';

import {MediaMonitor} from '../../media-query/media-monitor';
import {BaseFxDirective} from '../core/base';

const FLEX_FILL_CSS = {
  'margin': 0,
  'width': '100%',
  'height': '100%',
  'min-width': '100%',
  'min-height': '100%'
};

/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
@Directive({selector: `
  [fxFill],
  [fxFlexFill]
`})
export class FlexFillDirective extends BaseFxDirective {
  constructor(monitor: MediaMonitor, public elRef: ElementRef, public renderer: Renderer2) {
    super(monitor, elRef, renderer);
    this._applyStyleToElement(FLEX_FILL_CSS);
  }
}
