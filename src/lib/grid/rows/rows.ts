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

const CACHE_KEY = 'rows';
const DEFAULT_VALUE = 'none';
const AUTO_SPECIFIER = '!';

/**
 * 'grid-template-rows' CSS Grid styling directive
 * Configures the sizing for the rows in the grid
 * Syntax: <row value> [auto]
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-13
 */
@Directive({selector: `
  [gdRows],
  [gdRows.xs], [gdRows.sm], [gdRows.md], [gdRows.lg], [gdRows.xl],
  [gdRows.lt-sm], [gdRows.lt-md], [gdRows.lt-lg], [gdRows.lt-xl],
  [gdRows.gt-xs], [gdRows.gt-sm], [gdRows.gt-md], [gdRows.gt-lg]
`})
export class GridRowsDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdRows')       set align(val)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdRows.xs')    set alignXs(val)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdRows.sm')    set alignSm(val)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdRows.md')    set alignMd(val)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdRows.lg')    set alignLg(val)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdRows.xl')    set alignXl(val)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdRows.gt-xs') set alignGtXs(val) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdRows.gt-sm') set alignGtSm(val) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdRows.gt-md') set alignGtMd(val) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdRows.gt-lg') set alignGtLg(val) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdRows.lt-sm') set alignLtSm(val) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdRows.lt-md') set alignLtMd(val) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdRows.lt-lg') set alignLtLg(val) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdRows.lt-xl') set alignLtXl(val) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

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
    let auto = false;
    if (value.endsWith(AUTO_SPECIFIER)) {
      value = value.substring(0, value.indexOf(AUTO_SPECIFIER));
      auto = true;
    }

    let css = {
      'display': this._queryInput('inline') ? 'inline-grid' : 'grid',
      'grid-auto-rows': '',
      'grid-template-rows': '',
    };
    const key = (auto ? 'grid-auto-rows' : 'grid-template-rows');
    css[key] = value;

    return css;
  }
}
