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

const CACHE_KEY = 'alignColumns';
const DEFAULT_MAIN = 'start';
const DEFAULT_CROSS = 'stretch';

/**
 * 'column alignment' CSS Grid styling directive
 * Configures the alignment in the column direction
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-19
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-21
 */
@Directive({selector: `
  [gdAlignColumns],
  [gdAlignColumns.xs], [gdAlignColumns.sm], [gdAlignColumns.md],
  [gdAlignColumns.lg], [gdAlignColumns.xl], [gdAlignColumns.lt-sm],
  [gdAlignColumns.lt-md], [gdAlignColumns.lt-lg], [gdAlignColumns.lt-xl],
  [gdAlignColumns.gt-xs], [gdAlignColumns.gt-sm], [gdAlignColumns.gt-md],
  [gdAlignColumns.gt-lg]
`})
export class GridAlignColumnsDirective extends BaseDirective
  implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdAlignColumns')       set align(val)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdAlignColumns.xs')    set alignXs(val)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdAlignColumns.sm')    set alignSm(val)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdAlignColumns.md')    set alignMd(val)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdAlignColumns.lg')    set alignLg(val)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdAlignColumns.xl')    set alignXl(val)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdAlignColumns.gt-xs') set alignGtXs(val) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdAlignColumns.gt-sm') set alignGtSm(val) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdAlignColumns.gt-md') set alignGtMd(val) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdAlignColumns.gt-lg') set alignGtLg(val) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdAlignColumns.lt-sm') set alignLtSm(val) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdAlignColumns.lt-md') set alignLtMd(val) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdAlignColumns.lt-lg') set alignLtLg(val) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdAlignColumns.lt-xl') set alignLtXl(val) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

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

    return extendObject(css, {'display' : this._queryInput('inline') ? 'inline-grid' : 'grid'});
  }
}
