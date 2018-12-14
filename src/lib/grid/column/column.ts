/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Optional, Injectable} from '@angular/core';
import {
  BaseDirective2,
  StyleUtils,
  MediaMarshaller,
  StyleBuilder,
  StyleDefinition,
} from '@angular/flex-layout/core';

const DEFAULT_VALUE = 'auto';

@Injectable({providedIn: 'root'})
export class GridColumnStyleBuilder extends StyleBuilder {
  buildStyles(input: string) {
    return {'grid-column': input || DEFAULT_VALUE};
  }
}

export class GridColumnDirective extends BaseDirective2 {
  protected DIRECTIVE_KEY = 'grid-column';

  constructor(protected elementRef: ElementRef,
              // NOTE: not actually optional, but we need to force DI without a
              // constructor call
              @Optional() protected styleBuilder: GridColumnStyleBuilder,
              protected styler: StyleUtils,
              protected marshal: MediaMarshaller) {
    super(elementRef, styleBuilder, styler, marshal);
    this.marshal.init(this.elementRef.nativeElement, this.DIRECTIVE_KEY,
      this.addStyles.bind(this));
  }

  protected styleCache = columnCache;
}

const columnCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdColumn',
  'gdColumn.xs', 'gdColumn.sm', 'gdColumn.md', 'gdColumn.lg', 'gdColumn.xl',
  'gdColumn.lt-sm', 'gdColumn.lt-md', 'gdColumn.lt-lg', 'gdColumn.lt-xl',
  'gdColumn.gt-xs', 'gdColumn.gt-sm', 'gdColumn.gt-md', 'gdColumn.gt-lg'
];

const selector = `
  [gdColumn],
  [gdColumn.xs], [gdColumn.sm], [gdColumn.md], [gdColumn.lg], [gdColumn.xl],
  [gdColumn.lt-sm], [gdColumn.lt-md], [gdColumn.lt-lg], [gdColumn.lt-xl],
  [gdColumn.gt-xs], [gdColumn.gt-sm], [gdColumn.gt-md], [gdColumn.gt-lg]
`;

/**
 * 'grid-column' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-26
 */
@Directive({selector, inputs})
export class DefaultGridColumnDirective extends GridColumnDirective {
  protected inputs = inputs;
}
