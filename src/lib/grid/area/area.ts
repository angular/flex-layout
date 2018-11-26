/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Injectable, Optional} from '@angular/core';
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

export class GridAreaDirective extends BaseDirective2 {

  protected DIRECTIVE_KEY = 'grid-area';

  constructor(protected elRef: ElementRef,
              protected styleUtils: StyleUtils,
              // NOTE: not actually optional, but we need to force DI without a
              // constructor call
              @Optional() protected styleBuilder: GridAreaStyleBuilder,
              protected marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.marshal.init(this.elRef.nativeElement, this.DIRECTIVE_KEY,
      this.addStyles.bind(this));
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
