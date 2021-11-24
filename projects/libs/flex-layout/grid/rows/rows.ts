/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Input, Injectable} from '@angular/core';
import {
  MediaMarshaller,
  BaseDirective2,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const DEFAULT_VALUE = 'none';
const AUTO_SPECIFIER = '!';

export interface GridRowsParent {
  inline: boolean;
}

@Injectable({providedIn: 'root'})
export class GridRowsStyleBuilder extends StyleBuilder {
  buildStyles(input: string, parent: GridRowsParent) {
    input = input || DEFAULT_VALUE;
    let auto = false;
    if (input.endsWith(AUTO_SPECIFIER)) {
      input = input.substring(0, input.indexOf(AUTO_SPECIFIER));
      auto = true;
    }

    const css = {
      'display': parent.inline ? 'inline-grid' : 'grid',
      'grid-auto-rows': '',
      'grid-template-rows': '',
    };
    const key = (auto ? 'grid-auto-rows' : 'grid-template-rows');
    css[key] = input;

    return css;
  }
}

@Directive()
export class GridRowsDirective extends BaseDirective2 {
  protected DIRECTIVE_KEY = 'grid-rows';

  @Input('gdInline')
  get inline(): boolean { return this._inline; }
  set inline(val: boolean) { this._inline = coerceBooleanProperty(val); }
  protected _inline = false;

  constructor(elementRef: ElementRef,
              styleBuilder: GridRowsStyleBuilder,
              styler: StyleUtils,
              marshal: MediaMarshaller) {
    super(elementRef, styleBuilder, styler, marshal);
    this.init();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected updateWithValue(value: string) {
    this.styleCache = this.inline ? rowsInlineCache : rowsCache;
    this.addStyles(value, {inline: this.inline});
  }
}

const rowsCache: Map<string, StyleDefinition> = new Map();
const rowsInlineCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdRows',
  'gdRows.xs', 'gdRows.sm', 'gdRows.md', 'gdRows.lg', 'gdRows.xl',
  'gdRows.lt-sm', 'gdRows.lt-md', 'gdRows.lt-lg', 'gdRows.lt-xl',
  'gdRows.gt-xs', 'gdRows.gt-sm', 'gdRows.gt-md', 'gdRows.gt-lg'
];

const selector = `
  [gdRows],
  [gdRows.xs], [gdRows.sm], [gdRows.md], [gdRows.lg], [gdRows.xl],
  [gdRows.lt-sm], [gdRows.lt-md], [gdRows.lt-lg], [gdRows.lt-xl],
  [gdRows.gt-xs], [gdRows.gt-sm], [gdRows.gt-md], [gdRows.gt-lg]
`;

/**
 * 'grid-template-rows' CSS Grid styling directive
 * Configures the sizing for the rows in the grid
 * Syntax: <column value> [auto]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-13
 */
@Directive({selector, inputs})
export class DefaultGridRowsDirective extends GridRowsDirective {
  protected inputs = inputs;
}
