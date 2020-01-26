/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Input, Injectable} from '@angular/core';
import {
  BaseDirective2,
  StyleUtils,
  MediaMarshaller,
  StyleBuilder,
  StyleDefinition,
} from '@angular/flex-layout/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const DEFAULT_VALUE = '0';

export interface GridGapParent {
  inline: boolean;
}

@Injectable({providedIn: 'root'})
export class GridGapStyleBuilder extends StyleBuilder {
  buildStyles(input: string, parent: GridGapParent) {
    return {
      'display': parent.inline ? 'inline-grid' : 'grid',
      'grid-gap': input || DEFAULT_VALUE
    };
  }
}

@Directive()
export class GridGapDirective extends BaseDirective2 {
  protected DIRECTIVE_KEY = 'grid-gap';

  @Input('gdInline')
  get inline(): boolean { return this._inline; }
  set inline(val: boolean) { this._inline = coerceBooleanProperty(val); }
  protected _inline = false;

  constructor(elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: GridGapStyleBuilder,
              marshal: MediaMarshaller) {
    super(elRef, styleBuilder, styleUtils, marshal);
    this.init();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected updateWithValue(value: string) {
    this.styleCache = this.inline ? gapInlineCache : gapCache;
    this.addStyles(value, {inline: this.inline});
  }
}

const gapCache: Map<string, StyleDefinition> = new Map();
const gapInlineCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdGap',
  'gdGap.xs', 'gdGap.sm', 'gdGap.md', 'gdGap.lg', 'gdGap.xl',
  'gdGap.lt-sm', 'gdGap.lt-md', 'gdGap.lt-lg', 'gdGap.lt-xl',
  'gdGap.gt-xs', 'gdGap.gt-sm', 'gdGap.gt-md', 'gdGap.gt-lg'
];

const selector = `
  [gdGap],
  [gdGap.xs], [gdGap.sm], [gdGap.md], [gdGap.lg], [gdGap.xl],
  [gdGap.lt-sm], [gdGap.lt-md], [gdGap.lt-lg], [gdGap.lt-xl],
  [gdGap.gt-xs], [gdGap.gt-sm], [gdGap.gt-md], [gdGap.gt-lg]
`;

/**
 * 'grid-gap' CSS Grid styling directive
 * Configures the gap between items in the grid
 * Syntax: <row gap> [<column-gap>]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-17
 */
@Directive({selector, inputs})
export class DefaultGridGapDirective extends GridGapDirective {
  protected inputs = inputs;
}
