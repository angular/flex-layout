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

const CACHE_KEY = 'areas';
const DEFAULT_VALUE = 'none';
const DELIMETER = '|';

/**
 * 'grid-template-areas' CSS Grid styling directive
 * Configures the names of elements within the grid
 * @see https://css-tricks.com/snippets/css/complete-guide-grid/#article-header-id-14
 */
@Directive({selector: `
  [gdAreas],
  [gdAreas.xs], [gdAreas.sm], [gdAreas.md], [gdAreas.lg], [gdAreas.xl],
  [gdAreas.lt-sm], [gdAreas.lt-md], [gdAreas.lt-lg], [gdAreas.lt-xl],
  [gdAreas.gt-xs], [gdAreas.gt-sm], [gdAreas.gt-md], [gdAreas.gt-lg]
`})
export class GridAreasDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('gdAreas')       set align(val: string)     { this._cacheInput(`${CACHE_KEY}`, val); }
  @Input('gdAreas.xs')    set alignXs(val: string)   { this._cacheInput(`${CACHE_KEY}Xs`, val); }
  @Input('gdAreas.sm')    set alignSm(val: string)   { this._cacheInput(`${CACHE_KEY}Sm`, val); };
  @Input('gdAreas.md')    set alignMd(val: string)   { this._cacheInput(`${CACHE_KEY}Md`, val); };
  @Input('gdAreas.lg')    set alignLg(val: string)   { this._cacheInput(`${CACHE_KEY}Lg`, val); };
  @Input('gdAreas.xl')    set alignXl(val: string)   { this._cacheInput(`${CACHE_KEY}Xl`, val); };

  @Input('gdAreas.gt-xs') set alignGtXs(val: string) { this._cacheInput(`${CACHE_KEY}GtXs`, val); };
  @Input('gdAreas.gt-sm') set alignGtSm(val: string) { this._cacheInput(`${CACHE_KEY}GtSm`, val); };
  @Input('gdAreas.gt-md') set alignGtMd(val: string) { this._cacheInput(`${CACHE_KEY}GtMd`, val); };
  @Input('gdAreas.gt-lg') set alignGtLg(val: string) { this._cacheInput(`${CACHE_KEY}GtLg`, val); };

  @Input('gdAreas.lt-sm') set alignLtSm(val: string) { this._cacheInput(`${CACHE_KEY}LtSm`, val); };
  @Input('gdAreas.lt-md') set alignLtMd(val: string) { this._cacheInput(`${CACHE_KEY}LtMd`, val); };
  @Input('gdAreas.lt-lg') set alignLtLg(val: string) { this._cacheInput(`${CACHE_KEY}LtLg`, val); };
  @Input('gdAreas.lt-xl') set alignLtXl(val: string) { this._cacheInput(`${CACHE_KEY}LtXl`, val); };

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
    const areas = value.split(DELIMETER).map(v => `"${v.trim()}"`);

    return {
      'display': this._queryInput('inline') ? 'inline-grid' : 'grid',
      'grid-template-areas': areas.join(' ')
    };
  }
}
