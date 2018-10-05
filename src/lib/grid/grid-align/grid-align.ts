/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {BaseDirective, MediaChange, MediaMonitor, StyleUtils} from '@angular/flex-layout/core';

const CACHE_KEY = 'align';
const ROW_DEFAULT = 'stretch';
const COL_DEFAULT = 'stretch';

/**
 * 'align' CSS Grid styling directive for grid children
 *  Defines positioning of child elements along row and column axis in a grid container
 *  Optional values: {row-axis} values or {row-axis column-axis} value pairs
 *
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-justify-self
 *  @see https://css-tricks.com/snippets/css/complete-guide-grid/#prop-align-self
 */
@Directive({selector: `
  [gdGridAlign],
  [gdGridAlign.xs], [gdGridAlign.sm], [gdGridAlign.md], [gdGridAlign.lg],[gdGridAlign.xl],
  [gdGridAlign.lt-sm], [gdGridAlign.lt-md], [gdGridAlign.lt-lg], [gdGridAlign.lt-xl],
  [gdGridAlign.gt-xs], [gdGridAlign.gt-sm], [gdGridAlign.gt-md], [gdGridAlign.gt-lg]
`})
export class GridAlignDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdGridAlign')       set align(val: string)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdGridAlign.xs')    set alignXs(val: string)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdGridAlign.sm')    set alignSm(val: string)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdGridAlign.md')    set alignMd(val: string)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdGridAlign.lg')    set alignLg(val: string)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdGridAlign.xl')    set alignXl(val: string)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdGridAlign.gt-xs') set alignGtXs(val: string) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdGridAlign.gt-sm') set alignGtSm(val: string) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdGridAlign.gt-md') set alignGtMd(val: string) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdGridAlign.gt-lg') set alignGtLg(val: string) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdGridAlign.lt-sm') set alignLtSm(val: string) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdGridAlign.lt-md') set alignLtMd(val: string) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdGridAlign.lt-lg') set alignLtLg(val: string) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdGridAlign.lt-xl') set alignLtXl(val: string) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              styleUtils: StyleUtils) {
    super(monitor, elRef, styleUtils);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes[CACHE_KEY] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges(CACHE_KEY, ROW_DEFAULT, (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   *
   */
  protected _updateWithValue(value?: string) {
    value = value || this._queryInput(CACHE_KEY) || ROW_DEFAULT;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  protected _buildCSS(align: string = '') {
    let css: {[key: string]: string} = {}, [rowAxis, columnAxis] = align.split(' ');

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
}
