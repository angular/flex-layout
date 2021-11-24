/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, OnChanges, Injectable} from '@angular/core';
import {
  BaseDirective2,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
  MediaMarshaller,
} from '@angular/flex-layout/core';

@Injectable({providedIn: 'root'})
export class FlexOrderStyleBuilder extends StyleBuilder {
  buildStyles(value: string) {
    return {order: (value && parseInt(value, 10)) || ''};
  }
}

const inputs = [
  'fxFlexOrder', 'fxFlexOrder.xs', 'fxFlexOrder.sm', 'fxFlexOrder.md',
  'fxFlexOrder.lg', 'fxFlexOrder.xl', 'fxFlexOrder.lt-sm', 'fxFlexOrder.lt-md',
  'fxFlexOrder.lt-lg', 'fxFlexOrder.lt-xl', 'fxFlexOrder.gt-xs', 'fxFlexOrder.gt-sm',
  'fxFlexOrder.gt-md', 'fxFlexOrder.gt-lg'
];
const selector = `
  [fxFlexOrder], [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md],
  [fxFlexOrder.lg], [fxFlexOrder.xl], [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md],
  [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl], [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm],
  [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
`;

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive()
export class FlexOrderDirective extends BaseDirective2 implements OnChanges {

  protected DIRECTIVE_KEY = 'flex-order';

  constructor(elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: FlexOrderStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  protected styleCache = flexOrderCache;
}

const flexOrderCache: Map<string, StyleDefinition> = new Map();

@Directive({selector, inputs})
export class DefaultFlexOrderDirective extends FlexOrderDirective {
  protected inputs = inputs;
}
