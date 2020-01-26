/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Directive, ElementRef, Injectable, Input} from '@angular/core';
import {
  BaseDirective2,
  StyleUtils,
  StyleBuilder,
  StyleDefinition,
  MediaMarshaller,
} from '@angular/flex-layout/core';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';

export interface GridAlignColumnsParent {
  inline: boolean;
}

@Injectable({providedIn: 'root'})
export class GridAlignColumnsStyleBuilder extends StyleBuilder {
  buildStyles(input: string, parent: GridAlignColumnsParent) {
    return buildCss(input || `${DEFAULT_MAIN} ${DEFAULT_CROSS}`, parent.inline);
  }
}

@Directive()
export class GridAlignColumnsDirective extends BaseDirective2 {

  protected DIRECTIVE_KEY = 'grid-align-columns';

  @Input('gdInline')
  get inline(): boolean { return this._inline; }
  set inline(val: boolean) { this._inline = coerceBooleanProperty(val); }
  protected _inline = false;

  constructor(elementRef: ElementRef,
              styleBuilder: GridAlignColumnsStyleBuilder,
              styler: StyleUtils,
              marshal: MediaMarshaller) {
    super(elementRef, styleBuilder, styler, marshal);
    this.init();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected updateWithValue(value: string) {
    this.styleCache = this.inline ? alignColumnsInlineCache : alignColumnsCache;
    this.addStyles(value, {inline: this.inline});
  }
}

const alignColumnsCache: Map<string, StyleDefinition> = new Map();
const alignColumnsInlineCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdAlignColumns',
  'gdAlignColumns.xs', 'gdAlignColumns.sm', 'gdAlignColumns.md',
  'gdAlignColumns.lg', 'gdAlignColumns.xl', 'gdAlignColumns.lt-sm',
  'gdAlignColumns.lt-md', 'gdAlignColumns.lt-lg', 'gdAlignColumns.lt-xl',
  'gdAlignColumns.gt-xs', 'gdAlignColumns.gt-sm', 'gdAlignColumns.gt-md',
  'gdAlignColumns.gt-lg'
];
const selector = `
  [gdAlignColumns],
  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],
  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],
  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],
  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],
  [gdAlignColumns.gt-lg]
`;

/**
 * 'column alignment' CSS Grid styling directive
 * Configures the alignment in the column direction
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-19
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-21
 */
@Directive({selector, inputs})
export class DefaultGridAlignColumnsDirective extends GridAlignColumnsDirective {
  protected inputs = inputs;
}

function buildCss(align: string, inline: boolean): StyleDefinition {
  const css: {[key: string]: string} = {}, [mainAxis, crossAxis] = align.split(' ');

  // Main axis
  switch (mainAxis) {
    case 'center':
      css['align-content'] = 'center';
      break;
    case 'space-around':
      css['align-content'] = 'space-around';
      break;
    case 'space-between':
      css['align-content'] = 'space-between';
      break;
    case 'space-evenly':
      css['align-content'] = 'space-evenly';
      break;
    case 'end':
      css['align-content'] = 'end';
      break;
    case 'start':
      css['align-content'] = 'start';
      break;
    case 'stretch':
      css['align-content'] = 'stretch';
      break;
    default:
      css['align-content'] = DEFAULT_MAIN;  // default main axis
      break;
  }

  // Cross-axis
  switch (crossAxis) {
    case 'start':
      css['align-items'] = 'start';
      break;
    case 'center':
      css['align-items'] = 'center';
      break;
    case 'end':
      css['align-items'] = 'end';
      break;
    case 'stretch':
      css['align-items'] = 'stretch';
      break;
    default : // 'stretch'
      css['align-items'] = DEFAULT_CROSS;   // default cross axis
      break;
  }

  css['display'] = inline ? 'inline-grid' : 'grid';

  return css;
}
