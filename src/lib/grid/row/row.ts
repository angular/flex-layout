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

const CACHE_KEY = 'row';
const DEFAULT_VALUE = 'auto';

/**
 * 'grid-row' CSS Grid styling directive
 * Configures the name or position of an element within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-26
 */
@Directive({selector: `
  [gdRow],
  [gdRow.xs], [gdRow.sm], [gdRow.md], [gdRow.lg], [gdRow.xl],
  [gdRow.lt-sm], [gdRow.lt-md], [gdRow.lt-lg], [gdRow.lt-xl],
  [gdRow.gt-xs], [gdRow.gt-sm], [gdRow.gt-md], [gdRow.gt-lg]
`})
export class GridRowDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdRow')       set align(val)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdRow.xs')    set alignXs(val)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdRow.sm')    set alignSm(val)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdRow.md')    set alignMd(val)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdRow.lg')    set alignLg(val)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdRow.xl')    set alignXl(val)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdRow.gt-xs') set alignGtXs(val) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdRow.gt-sm') set alignGtSm(val) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdRow.gt-md') set alignGtMd(val) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdRow.gt-lg') set alignGtLg(val) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdRow.lt-sm') set alignLtSm(val) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdRow.lt-md') set alignLtMd(val) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdRow.lt-lg') set alignLtLg(val) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdRow.lt-xl') set alignLtXl(val) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

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

    this._listenForMediaQueryChanges(CACHE_KEY, DEFAULT_VALUE, (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected _updateWithValue(value?: string) {
    value = value || this._queryInput(CACHE_KEY) || DEFAULT_VALUE;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }


  protected _buildCSS(value) {
    return {'grid-row': value};
  }
}
