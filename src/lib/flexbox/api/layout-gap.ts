/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer,
  SimpleChanges,
  AfterContentInit
} from '@angular/core';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
@Directive({selector: `
  [fxLayoutGap],
  [fxLayoutGap.xs]
  [fxLayoutGap.gt-xs],
  [fxLayoutGap.sm],
  [fxLayoutGap.gt-sm]
  [fxLayoutGap.md],
  [fxLayoutGap.gt-md]
  [fxLayoutGap.lg],
  [fxLayoutGap.gt-lg],
  [fxLayoutGap.xl]
`})
export class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges {
  @Input('fxLayoutGap')       set gap(val)     { this._cacheInput('gap', val); }
  @Input('fxLayoutGap.xs')    set gapXs(val)   { this._cacheInput('gapXs', val); }
  @Input('fxLayoutGap.gt-xs') set gapGtXs(val) { this._cacheInput('gapGtXs', val); };
  @Input('fxLayoutGap.sm')    set gapSm(val)   { this._cacheInput('gapSm', val); };
  @Input('fxLayoutGap.gt-sm') set gapGtSm(val) { this._cacheInput('gapGtSm', val); };
  @Input('fxLayoutGap.md')    set gapMd(val)   { this._cacheInput('gapMd', val); };
  @Input('fxLayoutGap.gt-md') set gapGtMd(val) { this._cacheInput('gapGtMd', val); };
  @Input('fxLayoutGap.lg')    set gapLg(val)   { this._cacheInput('gapLg', val); };
  @Input('fxLayoutGap.gt-lg') set gapGtLg(val) { this._cacheInput('gapGtLg', val); };
  @Input('fxLayoutGap.xl')    set gapXl(val)   { this._cacheInput('gapXl', val); };

  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer ) {
    super(monitor, elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gap'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngAfterContentInit() {
    this._listenForMediaQueryChanges('gap', '0', (changes: MediaChange) => {
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
  private _updateWithValue(value?: string) {
    value = value || this._queryInput("gap") || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // For each `element` child, set the padding styles...
    let items = this.childrenNodes
          .filter( el => (el.nodeType === 1))   // only Element types
          .filter( (el, j) => j > 0 );          // skip first element since gaps are needed
    this._applyStyleToElements(this._buildCSS(value), items );
  }

  private _buildCSS(value) {
    return { 'margin-left' : value };
  }

}
