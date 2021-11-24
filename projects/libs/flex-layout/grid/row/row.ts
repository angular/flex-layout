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
export class GridRowStyleBuilder extends StyleBuilder {
  buildStyles(input: string) {
    return {'grid-row': input || DEFAULT_VALUE};
  }
}

@Directive()
export class GridRowDirective extends BaseDirective2 {
  protected DIRECTIVE_KEY = 'grid-row';

  constructor(elementRef: ElementRef,
              styleBuilder: GridRowStyleBuilder,
              styler: StyleUtils,
              marshal: MediaMarshaller) {
    super(elementRef, styleBuilder, styler, marshal);
    this.init();
  }

  protected styleCache = rowCache;
}

const rowCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdRow',
  'gdRow.xs', 'gdRow.sm', 'gdRow.md', 'gdRow.lg', 'gdRow.xl',
  'gdRow.lt-sm', 'gdRow.lt-md', 'gdRow.lt-lg', 'gdRow.lt-xl',
  'gdRow.gt-xs', 'gdRow.gt-sm', 'gdRow.gt-md', 'gdRow.gt-lg'
];

const selector = `
  [gdRow],
  [gdRow.xs], [gdRow.sm], [gdRow.md], [gdRow.lg], [gdRow.xl],
  [gdRow.lt-sm], [gdRow.lt-md], [gdRow.lt-lg], [gdRow.lt-xl],
  [gdRow.gt-xs], [gdRow.gt-sm], [gdRow.gt-md], [gdRow.gt-lg]
`;

/**
 * 'grid-row' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-26
 */
@Directive({selector, inputs})
export class DefaultGridRowDirective extends GridRowDirective {
  protected inputs = inputs;
}
