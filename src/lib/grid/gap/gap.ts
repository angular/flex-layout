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
import {coerceBooleanProperty} from '@angular/cdk/coercion';

const CACHE_KEY = 'gap';
const DEFAULT_VALUE = '0';

/**
 * 'grid-gap' CSS Grid styling directive
 * Configures the gap between items in the grid
 * Syntax: <row gap> [<column-gap>]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-17
 */
@Directive({selector: `
  [gdGap],
  [gdGap.xs], [gdGap.sm], [gdGap.md], [gdGap.lg], [gdGap.xl],
  [gdGap.lt-sm], [gdGap.lt-md], [gdGap.lt-lg], [gdGap.lt-xl],
  [gdGap.gt-xs], [gdGap.gt-sm], [gdGap.gt-md], [gdGap.gt-lg]
`})
export class GridGapDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdGap')       set align(val)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdGap.xs')    set alignXs(val)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdGap.sm')    set alignSm(val)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdGap.md')    set alignMd(val)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdGap.lg')    set alignLg(val)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdGap.xl')    set alignXl(val)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdGap.gt-xs') set alignGtXs(val) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdGap.gt-sm') set alignGtSm(val) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdGap.gt-md') set alignGtMd(val) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdGap.gt-lg') set alignGtLg(val) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdGap.lt-sm') set alignLtSm(val) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdGap.lt-md') set alignLtMd(val) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdGap.lt-lg') set alignLtLg(val) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdGap.lt-xl') set alignLtXl(val) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

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
    return {
      'display': this._queryInput('inline') ? 'inline-grid' : 'grid',
      'grid-gap': value
    };
  }
}
