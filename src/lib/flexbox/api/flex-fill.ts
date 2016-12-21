import {Directive, ElementRef, Renderer} from '@angular/core';

import {MediaMonitor} from '../../media-query/media-monitor';
import {BaseFxDirective} from './base';

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
  [fxFill.xs]
  [fxFill.gt-xs],
  [fxFill.sm],
  [fxFill.gt-sm]
  [fxFill.md],
  [fxFill.gt-md]
  [fxFill.lg],
  [fxFill.gt-lg],
  [fxFill.xl]
`})
export class FlexFillDirective extends BaseFxDirective {
  constructor(monitor : MediaMonitor, public elRef: ElementRef, public renderer: Renderer) {
    super(monitor, elRef, renderer);
    this._applyStyleToElement(FLEX_FILL_CSS);
  }
}
