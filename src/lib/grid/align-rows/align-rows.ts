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
  OnInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import {BaseDirective, MediaChange, MediaMonitor, StyleUtils} from '@angular/flex-layout/core';
import {extendObject} from '../../utils/object-extend';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const CACHE_KEY = 'alignRows';
const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';

/**
 * 'row alignment' CSS Grid styling directive
 * Configures the alignment in the row direction
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-18
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-20
 */
@Directive({selector: `
  [gdAlignRows],
  [gdAlignRows.xs], [gdAlignRows.sm], [gdAlignRows.md],
  [gdAlignRows.lg], [gdAlignRows.xl], [gdAlignRows.lt-sm],
  [gdAlignRows.lt-md], [gdAlignRows.lt-lg], [gdAlignRows.lt-xl],
  [gdAlignRows.gt-xs], [gdAlignRows.gt-sm], [gdAlignRows.gt-md],
  [gdAlignRows.gt-lg]
`})
export class GridAlignRowsDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdAlignRows')       set align(val)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdAlignRows.xs')    set alignXs(val)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdAlignRows.sm')    set alignSm(val)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdAlignRows.md')    set alignMd(val)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdAlignRows.lg')    set alignLg(val)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdAlignRows.xl')    set alignXl(val)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdAlignRows.gt-xs') set alignGtXs(val) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdAlignRows.gt-sm') set alignGtSm(val) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdAlignRows.gt-md') set alignGtMd(val) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdAlignRows.gt-lg') set alignGtLg(val) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdAlignRows.lt-sm') set alignLtSm(val) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdAlignRows.lt-md') set alignLtMd(val) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdAlignRows.lt-lg') set alignLtLg(val) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdAlignRows.lt-xl') set alignLtXl(val) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

  @Input('gdInline') set inline(val) { this._cacheInput('inline', coerceBooleanProperty(val)); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              styleUtils: StyleUtils) {
    super(monitor, elRef, styleUtils);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
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

    this._listenForMediaQueryChanges(CACHE_KEY, `${DEFAULT_MAIN} ${DEFAULT_CROSS}`,
      (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected _updateWithValue(value?: string) {
    value = value || this._queryInput(CACHE_KEY) || `${DEFAULT_MAIN} ${DEFAULT_CROSS}`;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }


  protected _buildCSS(align) {
    let css = {}, [mainAxis, crossAxis] = align.split(' ');

    // Main axis
    switch (mainAxis) {
      case 'center':
      case 'space-around':
      case 'space-between':
      case 'space-evenly':
      case 'end':
      case 'start':
      case 'stretch':
        css['justify-content'] = mainAxis;
        break;
      default:
        css['justify-content'] = DEFAULT_MAIN;  // default main axis
        break;
    }

    // Cross-axis
    switch (crossAxis) {
      case 'start':
      case 'center':
      case 'end':
      case 'stretch':
        css['justify-items'] = crossAxis;
        break;
      default : // 'stretch'
        css['justify-items'] = DEFAULT_CROSS;   // default cross axis
        break;
    }

    return extendObject(css, {'display' : this._queryInput('inline') ? 'inline-grid' : 'grid'});
  }
}
