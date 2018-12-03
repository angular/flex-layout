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
  Injectable,
} from '@angular/core';
import {
  BaseDirective,
  MediaChange,
  MediaMonitor,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';
import {Subscription} from 'rxjs';

import {extendObject} from '../../utils/object-extend';
import {Layout, LayoutDirective} from '../layout/layout';
import {LAYOUT_VALUES, isFlowHorizontal} from '../../utils/layout-validator';

type LayoutAlignMainAxisValuesType
  = ''
  | 'start' | 'flex-start'
  | 'flex-start'
  | 'center'
  | 'end' | 'flex-end'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  ;

type LayoutAlignCrossAxisValuesType
  = LayoutAlignMainAxisValuesType
  | 'stretch'
  | 'baseline'
  ;

/**
 * Combinations of all flex layout align values
 *
 * @see https://github.com/angular/flex-layout/wiki/fxLayoutAlign-API
 */
type LayoutAlignValuesType
  = LayoutAlignMainAxisValuesType
// Main Axis combinations with Cross Axis - start (flex-start)
  | 'start start' | 'start flex-start'
  | 'center start' | 'center flex-start'
  | 'end start' | 'end flex-start'
  | 'space-around start' | 'space-around flex-start'
  | 'space-between start' | 'space-between flex-start'
  | 'space-evenly start' | 'space-evenly flex-start'
// Main Axis combinations with Cross Axis - center
  | 'start center'
  | 'center center'
  | 'end center'
  | 'space-around center'
  | 'space-between center'
  | 'space-evenly center'
// Main Axis combinations with Cross Axis - end (flex-end)
  | 'start end' | 'start flex-end'
  | 'center end' | 'center flex-end'
  | 'end end' | 'end flex-end'
  | 'space-around end' | 'space-around flex-end'
  | 'space-between end' | 'space-between flex-end'
  | 'space-evenly end' | 'space-evenly flex-end'
// Main Axis combinations with Cross Axis - space-around
  | 'start space-around'
  | 'center space-around'
  | 'end space-around'
  | 'space-around space-around'
  | 'space-between space-around'
  | 'space-evenly space-around'
// Main Axis combinations with Cross Axis - space-between
  | 'start space-between'
  | 'center space-between'
  | 'end space-between'
  | 'space-around space-between'
  | 'space-between space-between'
  | 'space-evenly space-between'
// Main Axis combinations with Cross Axis - space-evenly
  | 'start space-evenly'
  | 'center space-evenly'
  | 'end space-evenly'
  | 'space-around space-evenly'
  | 'space-between space-evenly'
  | 'space-evenly space-evenly'
// Main Axis combinations with Cross Axis - stretch
  | 'start stretch'
  | 'center stretch'
  | 'end stretch'
  | 'space-around stretch'
  | 'space-between stretch'
  | 'space-evenly stretch'
// Main Axis combinations with Cross Axis - baseline
  | 'start baseline'
  | 'center baseline'
  | 'end baseline'
  | 'space-around baseline'
  | 'space-between baseline'
  | 'space-evenly baseline'
  ;

export interface LayoutAlignParent {
  layout: string;
}

@Injectable({providedIn: 'root'})
export class LayoutAlignStyleBuilder extends StyleBuilder {
  buildStyles(align: string, parent: LayoutAlignParent) {
    const css: StyleDefinition = {}, [mainAxis, crossAxis] =
        align.split(' ') as [LayoutAlignMainAxisValuesType, LayoutAlignCrossAxisValuesType];

    // Main axis
    switch (mainAxis) {
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
    switch (crossAxis) {
      case 'start':
      case 'flex-start':
        css['align-items'] = css['align-content'] = 'flex-start';
        break;
      case 'center':
        css['align-items'] = css['align-content'] = 'center';
        break;
      case 'end':
      case 'flex-end':
        css['align-items'] = css['align-content'] = 'flex-end';
        break;
      case 'space-between':
        css['align-content'] = 'space-between';
        css['align-items'] = 'stretch';
        break;
      case 'space-around':
        css['align-content'] = 'space-around';
        css['align-items'] = 'stretch';
        break;
      case 'baseline':
        css['align-content'] = 'stretch';
        css['align-items'] = 'baseline';
        break;
      case 'stretch':
      default : // 'stretch'
        css['align-items'] = css['align-content'] = 'stretch';   // default cross axis
        break;
    }

    return extendObject(css, {
      'display' : 'flex',
      'flex-direction' : parent.layout,
      'box-sizing' : 'border-box',
      'max-width': crossAxis === 'stretch' ?
        !isFlowHorizontal(parent.layout) ? '100%' : null : null,
      'max-height': crossAxis === 'stretch' ?
        isFlowHorizontal(parent.layout) ? '100%' : null : null,
    }) as StyleDefinition;
  }
}

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
export class LayoutAlignDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

  protected _layout = 'row';  // default flex-direction
  protected _layoutWatcher?: Subscription;

  /* tslint:disable */
  @Input('fxLayoutAlign')       set align(val: LayoutAlignValuesType)     { this._cacheInput('align', val); }
  @Input('fxLayoutAlign.xs')    set alignXs(val: LayoutAlignValuesType)   { this._cacheInput('alignXs', val); }
  @Input('fxLayoutAlign.sm')    set alignSm(val: LayoutAlignValuesType)   { this._cacheInput('alignSm', val); };
  @Input('fxLayoutAlign.md')    set alignMd(val: LayoutAlignValuesType)   { this._cacheInput('alignMd', val); };
  @Input('fxLayoutAlign.lg')    set alignLg(val: LayoutAlignValuesType)   { this._cacheInput('alignLg', val); };
  @Input('fxLayoutAlign.xl')    set alignXl(val: LayoutAlignValuesType)   { this._cacheInput('alignXl', val); };

  @Input('fxLayoutAlign.gt-xs') set alignGtXs(val: LayoutAlignValuesType) { this._cacheInput('alignGtXs', val); };
  @Input('fxLayoutAlign.gt-sm') set alignGtSm(val: LayoutAlignValuesType) { this._cacheInput('alignGtSm', val); };
  @Input('fxLayoutAlign.gt-md') set alignGtMd(val: LayoutAlignValuesType) { this._cacheInput('alignGtMd', val); };
  @Input('fxLayoutAlign.gt-lg') set alignGtLg(val: LayoutAlignValuesType) { this._cacheInput('alignGtLg', val); };

  @Input('fxLayoutAlign.lt-sm') set alignLtSm(val: LayoutAlignValuesType) { this._cacheInput('alignLtSm', val); };
  @Input('fxLayoutAlign.lt-md') set alignLtMd(val: LayoutAlignValuesType) { this._cacheInput('alignLtMd', val); };
  @Input('fxLayoutAlign.lt-lg') set alignLtLg(val: LayoutAlignValuesType) { this._cacheInput('alignLtLg', val); };
  @Input('fxLayoutAlign.lt-xl') set alignLtXl(val: LayoutAlignValuesType) { this._cacheInput('alignLtXl', val); };

  /* tslint:enable */
  constructor(
      monitor: MediaMonitor,
      elRef: ElementRef,
      @Optional() @Self() container: LayoutDirective,
      styleUtils: StyleUtils,
      styleBuilder: LayoutAlignStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);

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

    const layout = this._layout || 'row';
    this._styleCache = layout === 'row' ?
      layoutAlignHorizontalCache : layoutAlignVerticalCache;
    this.addStyles(value || '', {layout});
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
    this.addStyles(value, {layout: this._layout || 'row'});
  }
}

const layoutAlignHorizontalCache: Map<string, StyleDefinition> = new Map();
const layoutAlignVerticalCache: Map<string, StyleDefinition> = new Map();
