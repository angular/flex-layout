/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Injectable} from '@angular/core';
import {
  MediaMarshaller,
  BaseDirective2,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';

@Injectable({providedIn: 'root'})
export class FlexAlignStyleBuilder extends StyleBuilder {
  buildStyles(input: string) {
    input = input || 'stretch';
    const styles: StyleDefinition = {};

    // Cross-axis
    switch (input) {
      case 'start':
        styles['align-self'] = 'flex-start';
        break;
      case 'end':
        styles['align-self'] = 'flex-end';
        break;
      default:
        styles['align-self'] = input;
        break;
    }

    return styles;
  }
}

const inputs = [
  'fxFlexAlign', 'fxFlexAlign.xs', 'fxFlexAlign.sm', 'fxFlexAlign.md',
  'fxFlexAlign.lg', 'fxFlexAlign.xl', 'fxFlexAlign.lt-sm', 'fxFlexAlign.lt-md',
  'fxFlexAlign.lt-lg', 'fxFlexAlign.lt-xl', 'fxFlexAlign.gt-xs', 'fxFlexAlign.gt-sm',
  'fxFlexAlign.gt-md', 'fxFlexAlign.gt-lg'
];
const selector = `
  [fxFlexAlign], [fxFlexAlign.xs], [fxFlexAlign.sm], [fxFlexAlign.md],
  [fxFlexAlign.lg], [fxFlexAlign.xl], [fxFlexAlign.lt-sm], [fxFlexAlign.lt-md],
  [fxFlexAlign.lt-lg], [fxFlexAlign.lt-xl], [fxFlexAlign.gt-xs], [fxFlexAlign.gt-sm],
  [fxFlexAlign.gt-md], [fxFlexAlign.gt-lg]
`;

/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
@Directive()
export class FlexAlignDirective extends BaseDirective2 {

  protected DIRECTIVE_KEY = 'flex-align';

  constructor(elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: FlexAlignStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  protected styleCache = flexAlignCache;
}

const flexAlignCache: Map<string, StyleDefinition> = new Map();

@Directive({selector, inputs})
export class DefaultFlexAlignDirective extends FlexAlignDirective {
  protected inputs = inputs;
}
