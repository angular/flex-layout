/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, OnChanges, Injectable, Optional} from '@angular/core';
import {
  BaseDirective2,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
  MediaMarshaller,
} from '@angular/flex-layout/core';

import {buildLayoutCSS} from '../../utils/layout-validator';

@Injectable({providedIn: 'root'})
export class LayoutStyleBuilder extends StyleBuilder {
  buildStyles(input: string) {
    return buildLayoutCSS(input);
  }
}

const inputs = [
  'fxLayout', 'fxLayout.xs', 'fxLayout.sm', 'fxLayout.md',
  'fxLayout.lg', 'fxLayout.xl', 'fxLayout.lt-sm', 'fxLayout.lt-md',
  'fxLayout.lt-lg', 'fxLayout.lt-xl', 'fxLayout.gt-xs', 'fxLayout.gt-sm',
  'fxLayout.gt-md', 'fxLayout.gt-lg'
];
const selector = `
  [fxLayout], [fxLayout.xs], [fxLayout.sm], [fxLayout.md],
  [fxLayout.lg], [fxLayout.xl], [fxLayout.lt-sm], [fxLayout.lt-md],
  [fxLayout.lt-lg], [fxLayout.lt-xl], [fxLayout.gt-xs], [fxLayout.gt-sm],
  [fxLayout.gt-md], [fxLayout.gt-lg]
`;

/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export class LayoutDirective extends BaseDirective2 implements OnChanges {

  protected DIRECTIVE_KEY = 'layout';

  constructor(protected elRef: ElementRef,
              protected styleUtils: StyleUtils,
              // NOTE: not actually optional, but we need to force DI without a
              // constructor call
              @Optional() protected styleBuilder: LayoutStyleBuilder,
              protected marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.marshal.init(this.elRef.nativeElement, this.DIRECTIVE_KEY,
      this.addStyles.bind(this));
  }

  protected styleCache = layoutCache;
}

@Directive({selector, inputs})
export class DefaultLayoutDirective extends LayoutDirective {
  protected inputs = inputs;
}

const layoutCache: Map<string, StyleDefinition> = new Map();
