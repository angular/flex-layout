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

const CACHE_KEY = 'autoFlow';
const DEFAULT_VALUE = 'initial';

/**
 * 'grid-auto-flow' CSS Grid styling directive
 * Configures the auto placement algorithm for the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-23
 */
@Directive({selector: `
  [gdAuto],
  [gdAuto.xs], [gdAuto.sm], [gdAuto.md], [gdAuto.lg], [gdAuto.xl],
  [gdAuto.lt-sm], [gdAuto.lt-md], [gdAuto.lt-lg], [gdAuto.lt-xl],
  [gdAuto.gt-xs], [gdAuto.gt-sm], [gdAuto.gt-md], [gdAuto.gt-lg]
`})
export class GridAutoDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdAuto')       set align(val: string)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdAuto.xs')    set alignXs(val: string)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdAuto.sm')    set alignSm(val: string)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdAuto.md')    set alignMd(val: string)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdAuto.lg')    set alignLg(val: string)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdAuto.xl')    set alignXl(val: string)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdAuto.gt-xs') set alignGtXs(val: string) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdAuto.gt-sm') set alignGtSm(val: string) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdAuto.gt-md') set alignGtMd(val: string) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdAuto.gt-lg') set alignGtLg(val: string) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdAuto.lt-sm') set alignLtSm(val: string) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdAuto.lt-md') set alignLtMd(val: string) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdAuto.lt-lg') set alignLtLg(val: string) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdAuto.lt-xl') set alignLtXl(val: string) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

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
    let [direction, dense] = value.split(' ');
    if (direction !== 'column' && direction !== 'row' && direction !== 'dense') {
      direction = 'row';
    }

    dense = (dense === 'dense' && direction !== 'dense') ? ' dense' : '';

    return {
      'display': this._queryInput('inline') ? 'inline-grid' : 'grid',
      'grid-auto-flow': direction + dense
    };
  }
}
