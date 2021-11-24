/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Injectable} from '@angular/core';
import {
  BaseDirective2,
  StyleUtils,
  MediaMarshaller,
  StyleBuilder,
  StyleDefinition,
} from '@angular/flex-layout/core';

const DEFAULT_VALUE = 'auto';

@Injectable({providedIn: 'root'})
export class GridAreaStyleBuilder extends StyleBuilder {
  buildStyles(input: string) {
    return {'grid-area': input || DEFAULT_VALUE};
  }
}

@Directive()
export class GridAreaDirective extends BaseDirective2 {

  protected DIRECTIVE_KEY = 'grid-area';

  constructor(elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: GridAreaStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  protected styleCache = gridAreaCache;
}

const gridAreaCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdArea',
  'gdArea.xs', 'gdArea.sm', 'gdArea.md', 'gdArea.lg', 'gdArea.xl',
  'gdArea.lt-sm', 'gdArea.lt-md', 'gdArea.lt-lg', 'gdArea.lt-xl',
  'gdArea.gt-xs', 'gdArea.gt-sm', 'gdArea.gt-md', 'gdArea.gt-lg'
];
const selector = `
  [gdArea],
  [gdArea.xs], [gdArea.sm], [gdArea.md], [gdArea.lg], [gdArea.xl],
  [gdArea.lt-sm], [gdArea.lt-md], [gdArea.lt-lg], [gdArea.lt-xl],
  [gdArea.gt-xs], [gdArea.gt-sm], [gdArea.gt-md], [gdArea.gt-lg]
`;

/**
 * 'grid-area' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-27
 */
@Directive({selector, inputs})
export class DefaultGridAreaDirective extends GridAreaDirective {
  protected inputs = inputs;
}
