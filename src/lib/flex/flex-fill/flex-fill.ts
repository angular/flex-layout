/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Injectable} from '@angular/core';
import {
  BaseDirective,
  MediaMonitor,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';

const FLEX_FILL_CSS = {
  'margin': 0,
  'width': '100%',
  'height': '100%',
  'min-width': '100%',
  'min-height': '100%'
};

@Injectable({providedIn: 'root'})
export class FlexFillStyleBuilder implements StyleBuilder {
  buildStyles(_input: string): StyleDefinition {
    return FLEX_FILL_CSS;
  }
}

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
export class FlexFillDirective extends BaseDirective {
  constructor(monitor: MediaMonitor,
              public elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: FlexFillStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);
    this.addStyles('');
  }
}
