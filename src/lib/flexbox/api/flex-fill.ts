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
 * 'fx-fill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fx-fill is NOT responsive API!!
 */
@Directive({selector: `
  [fx-fill],
  [fx-fill.xs]
  [fx-fill.gt-xs],
  [fx-fill.sm],
  [fx-fill.gt-sm]
  [fx-fill.md],
  [fx-fill.gt-md]
  [fx-fill.lg],
  [fx-fill.gt-lg],
  [fx-fill.xl]
`})
export class FlexFillDirective extends BaseFxDirective {
  constructor(monitor : MediaMonitor, public elRef: ElementRef, public renderer: Renderer) {
    super(monitor, elRef, renderer);
    this._applyStyleToElement(FLEX_FILL_CSS);
  }
}
