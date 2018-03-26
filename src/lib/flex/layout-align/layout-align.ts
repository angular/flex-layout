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
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  Self,
} from '@angular/core';
import {BaseFxDirective, MediaChange, MediaMonitor, StyleUtils} from '@angular/flex-layout/core';
import {Subscription} from 'rxjs';

import {extendObject} from '../../utils/object-extend';
import {Layout, LayoutDirective} from '../layout/layout';
import {LAYOUT_VALUES, isFlowHorizontal} from '../../utils/layout-validator';

/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
@Directive({selector: `
  [fxLayoutAlign],
  [fxLayoutAlign.xs], [fxLayoutAlign.sm], [fxLayoutAlign.md], [fxLayoutAlign.lg],[fxLayoutAlign.xl],
  [fxLayoutAlign.lt-sm], [fxLayoutAlign.lt-md], [fxLayoutAlign.lt-lg], [fxLayoutAlign.lt-xl],
  [fxLayoutAlign.gt-xs], [fxLayoutAlign.gt-sm], [fxLayoutAlign.gt-md], [fxLayoutAlign.gt-lg]
`})
export class LayoutAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  protected _layout = 'row';  // default flex-direction
  protected _layoutWatcher: Subscription;

  /* tslint:disable */
  @Input('fxLayoutAlign')       set align(val)     { this._cacheInput('align', val); }
  @Input('fxLayoutAlign.xs')    set alignXs(val)   { this._cacheInput('alignXs', val); }
  @Input('fxLayoutAlign.sm')    set alignSm(val)   { this._cacheInput('alignSm', val); };
  @Input('fxLayoutAlign.md')    set alignMd(val)   { this._cacheInput('alignMd', val); };
  @Input('fxLayoutAlign.lg')    set alignLg(val)   { this._cacheInput('alignLg', val); };
  @Input('fxLayoutAlign.xl')    set alignXl(val)   { this._cacheInput('alignXl', val); };

  @Input('fxLayoutAlign.gt-xs') set alignGtXs(val) { this._cacheInput('alignGtXs', val); };
  @Input('fxLayoutAlign.gt-sm') set alignGtSm(val) { this._cacheInput('alignGtSm', val); };
  @Input('fxLayoutAlign.gt-md') set alignGtMd(val) { this._cacheInput('alignGtMd', val); };
  @Input('fxLayoutAlign.gt-lg') set alignGtLg(val) { this._cacheInput('alignGtLg', val); };

  @Input('fxLayoutAlign.lt-sm') set alignLtSm(val) { this._cacheInput('alignLtSm', val); };
  @Input('fxLayoutAlign.lt-md') set alignLtMd(val) { this._cacheInput('alignLtMd', val); };
  @Input('fxLayoutAlign.lt-lg') set alignLtLg(val) { this._cacheInput('alignLtLg', val); };
  @Input('fxLayoutAlign.lt-xl') set alignLtXl(val) { this._cacheInput('alignLtXl', val); };

  /* tslint:enable */
  constructor(
      monitor: MediaMonitor,
      elRef: ElementRef,
      @Optional() @Self() container: LayoutDirective,
      styleUtils: StyleUtils) {
    super(monitor, elRef, styleUtils);

    if (container) {  // Subscribe to layout direction changes
      this._layoutWatcher = container.layout$.subscribe(this._onLayoutChange.bind(this));
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['align'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('align', 'start stretch', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    if ( this._layoutWatcher ) {
      this._layoutWatcher.unsubscribe();
    }
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   *
   */
  protected _updateWithValue(value?: string) {
    value = value || this._queryInput('align') || 'start stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
    this._allowStretching(value, !this._layout ? 'row' : this._layout);
  }

  /**
   * Cache the parent container 'flex-direction' and update the 'flex' styles
   */
  protected _onLayoutChange(layout: Layout) {
    this._layout = (layout.direction || '').toLowerCase();
    if (!LAYOUT_VALUES.find(x => x === this._layout)) {
      this._layout = 'row';
    }

    let value = this._queryInput('align') || 'start stretch';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }
    this._allowStretching(value, this._layout || 'row');
  }

  protected _buildCSS(align) {
    let css = {}, [main_axis, cross_axis] = align.split(' '); // tslint:disable-line:variable-name

    // Main axis
    switch (main_axis) {
      case 'center':
        css['justify-content'] = 'center';
        break;
      case 'space-around':
        css['justify-content'] = 'space-around';
        break;
      case 'space-between':
        css['justify-content'] = 'space-between';
        break;
      case 'space-evenly':
        css['justify-content'] = 'space-evenly';
        break;
      case 'end':
      case 'flex-end':
        css['justify-content'] = 'flex-end';
        break;
      case 'start':
      case 'flex-start':
      default :
        css['justify-content'] = 'flex-start';  // default main axis
        break;
    }

    // Cross-axis
    switch (cross_axis) {
      case 'start':
      case 'flex-start':
        css['align-items'] = css['align-content'] = 'flex-start';
        break;
      case 'baseline':
        css['align-items'] = 'baseline';
        break;
      case 'center':
        css['align-items'] = css['align-content'] = 'center';
        break;
      case 'end':
      case 'flex-end':
        css['align-items'] = css['align-content'] = 'flex-end';
        break;
      case 'stretch':
      default : // 'stretch'
        css['align-items'] = css['align-content'] = 'stretch';   // default cross axis
        break;
    }

    return extendObject(css, {
      'display' : 'flex',
      'flex-direction' : this._layout || 'row',
      'box-sizing' : 'border-box'
    });
  }


  /**
   * Update container element to 'stretch' as needed...
   * NOTE: this is only done if the crossAxis is explicitly set to 'stretch'
   */
  protected _allowStretching(align, layout) {
    let [, cross_axis] = align.split(' '); // tslint:disable-line:variable-name

    if (cross_axis == 'stretch') {
      // Use `null` values to remove style
      this._applyStyleToElement({
        'box-sizing': 'border-box',
        'max-width': !isFlowHorizontal(layout) ? '100%' : null,
        'max-height': isFlowHorizontal(layout) ? '100%' : null
      });
    }
  }
}
