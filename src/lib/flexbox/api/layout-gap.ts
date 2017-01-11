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
  Self,
  AfterContentInit,
  Optional,
  OnDestroy,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {LayoutDirective, LAYOUT_VALUES} from './layout';

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
export class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges,
                                                                   OnDestroy {
  private _layout = 'row';  // default flex-direction
  private _layoutWatcher: Subscription;

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

  constructor(
    monitor: MediaMonitor,
    elRef: ElementRef,
    renderer: Renderer,
    @Optional() @Self() container: LayoutDirective) {
    super(monitor, elRef, renderer);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
    }
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

  ngOnDestroy() {
     super.ngOnDestroy();
     if (this._layoutWatcher) {
       this._layoutWatcher.unsubscribe();
     }
   }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Cache the parent container 'flex-direction' and update the 'margin' styles
   */
  private _onLayoutChange(direction) {
    this._layout = (direction || '').toLowerCase();
    if (!LAYOUT_VALUES.find(x => x === this._layout)) {
      this._layout = 'row';
    }

    this._updateWithValue();
  }

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
    let margin = 'margin-left';
    if (this._layout === 'row-reverse') { margin = 'margin-right'; }
    if (this._layout === 'column') { margin = 'margin-top'; }
    if (this._layout === 'column-reverse') { margin = 'margin-bottom'; }
    return { [margin] : value };
  }

}
