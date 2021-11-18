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

const ROW_DEFAULT = 'stretch';
const COL_DEFAULT = 'stretch';

@Injectable({providedIn: 'root'})
export class GridAlignStyleBuilder extends StyleBuilder {
  buildStyles(input: string) {
    return buildCss(input || ROW_DEFAULT);
  }
}

@Directive()
export class GridAlignDirective extends BaseDirective2 {

  protected DIRECTIVE_KEY = 'grid-align';

  constructor(elementRef: ElementRef,
              styleBuilder: GridAlignStyleBuilder,
              styler: StyleUtils,
              marshal: MediaMarshaller) {
    super(elementRef, styleBuilder, styler, marshal);
    this.init();
  }

  protected styleCache = alignCache;
}

const alignCache: Map<string, StyleDefinition> = new Map();

const inputs = [
  'gdGridAlign',
  'gdGridAlign.xs', 'gdGridAlign.sm', 'gdGridAlign.md', 'gdGridAlign.lg', 'gdGridAlign.xl',
  'gdGridAlign.lt-sm', 'gdGridAlign.lt-md', 'gdGridAlign.lt-lg', 'gdGridAlign.lt-xl',
  'gdGridAlign.gt-xs', 'gdGridAlign.gt-sm', 'gdGridAlign.gt-md', 'gdGridAlign.gt-lg'
];

const selector = `
  [gdGridAlign],
  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],
  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],
  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]
`;

/**
 * 'align' CSS Grid styling directive for grid children
 *  Defines positioning of child elements along row and column axis in a grid container
 *  Optional values: {row-axis} values or {row-axis column-axis} value pairs
 *
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-justify-self
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-align-self
 */
@Directive({selector, inputs})
export class DefaultGridAlignDirective extends GridAlignDirective {
  protected inputs = inputs;
}

function buildCss(align: string = '') {
  const css: {[key: string]: string} = {}, [rowAxis, columnAxis] = align.split(' ');

  // Row axis
  switch (rowAxis) {
    case 'end':
      css['justify-self'] = 'end';
      break;
    case 'center':
      css['justify-self'] = 'center';
      break;
    case 'stretch':
      css['justify-self'] = 'stretch';
      break;
    case 'start':
      css['justify-self'] = 'start';
      break;
    default:
      css['justify-self'] = ROW_DEFAULT;  // default row axis
      break;
  }

  // Column axis
  switch (columnAxis) {
    case 'end':
      css['align-self'] = 'end';
      break;
    case 'center':
      css['align-self'] = 'center';
      break;
    case 'stretch':
      css['align-self'] = 'stretch';
      break;
    case 'start':
      css['align-self'] = 'start';
      break;
    default:
      css['align-self'] = COL_DEFAULT;  // default column axis
      break;
  }

  return css;
}
