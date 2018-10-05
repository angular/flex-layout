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

const CACHE_KEY = 'columns';
const DEFAULT_VALUE = 'none';
const AUTO_SPECIFIER = '!';

/**
 * 'grid-template-columns' CSS Grid styling directive
 * Configures the sizing for the columns in the grid
 * Syntax: <column value> [auto]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-13
 */
@Directive({selector: `
  [gdColumns],
  [gdColumns.xs], [gdColumns.sm], [gdColumns.md], [gdColumns.lg], [gdColumns.xl],
  [gdColumns.lt-sm], [gdColumns.lt-md], [gdColumns.lt-lg], [gdColumns.lt-xl],
  [gdColumns.gt-xs], [gdColumns.gt-sm], [gdColumns.gt-md], [gdColumns.gt-lg]
`})
export class GridColumnsDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdColumns')       set align(val: string)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdColumns.xs')    set alignXs(val: string)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdColumns.sm')    set alignSm(val: string)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdColumns.md')    set alignMd(val: string)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdColumns.lg')    set alignLg(val: string)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdColumns.xl')    set alignXl(val: string)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdColumns.gt-xs') set alignGtXs(val: string) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdColumns.gt-sm') set alignGtSm(val: string) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdColumns.gt-md') set alignGtMd(val: string) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdColumns.gt-lg') set alignGtLg(val: string) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdColumns.lt-sm') set alignLtSm(val: string) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdColumns.lt-md') set alignLtMd(val: string) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdColumns.lt-lg') set alignLtLg(val: string) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdColumns.lt-xl') set alignLtXl(val: string) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

  @Input('gdInline') set inline(val: string) { this._cacheInput('inline', coerceBooleanProperty(val)); };

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


  protected _buildCSS(value: string = '') {
    let auto = false;
    if (value.endsWith(AUTO_SPECIFIER)) {
      value = value.substring(0, value.indexOf(AUTO_SPECIFIER));
      auto = true;
    }

    let css = {
      'display': this._queryInput('inline') ? 'inline-grid' : 'grid',
      'grid-auto-columns': '',
      'grid-template-columns': '',
    };
    const key = (auto ? 'grid-auto-columns' : 'grid-template-columns');
    css[key] = value;

    return css;
  }
}
