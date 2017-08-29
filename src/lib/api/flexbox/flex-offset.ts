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
  OnInit,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2,
  SimpleChanges,
  SkipSelf
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from '../core/base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {LayoutDirective} from './layout';
import {isFlowHorizontal} from '../../utils/layout-validator';

/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
@Directive({selector: `
  [fxFlexOffset],
  [fxFlexOffset.xs], [fxFlexOffset.sm], [fxFlexOffset.md], [fxFlexOffset.lg], [fxFlexOffset.xl],
  [fxFlexOffset.lt-sm], [fxFlexOffset.lt-md], [fxFlexOffset.lt-lg], [fxFlexOffset.lt-xl],
  [fxFlexOffset.gt-xs], [fxFlexOffset.gt-sm], [fxFlexOffset.gt-md], [fxFlexOffset.gt-lg]
`})
export class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('fxFlexOffset')       set offset(val)     { this._cacheInput('offset', val); }
  @Input('fxFlexOffset.xs')    set offsetXs(val)   { this._cacheInput('offsetXs', val); }
  @Input('fxFlexOffset.sm')    set offsetSm(val)   { this._cacheInput('offsetSm', val); };
  @Input('fxFlexOffset.md')    set offsetMd(val)   { this._cacheInput('offsetMd', val); };
  @Input('fxFlexOffset.lg')    set offsetLg(val)   { this._cacheInput('offsetLg', val); };
  @Input('fxFlexOffset.xl')    set offsetXl(val)   { this._cacheInput('offsetXl', val); };

  @Input('fxFlexOffset.lt-sm') set offsetLtSm(val) { this._cacheInput('offsetLtSm', val); };
  @Input('fxFlexOffset.lt-md') set offsetLtMd(val) { this._cacheInput('offsetLtMd', val); };
  @Input('fxFlexOffset.lt-lg') set offsetLtLg(val) { this._cacheInput('offsetLtLg', val); };
  @Input('fxFlexOffset.lt-xl') set offsetLtXl(val) { this._cacheInput('offsetLtXl', val); };

  @Input('fxFlexOffset.gt-xs') set offsetGtXs(val) { this._cacheInput('offsetGtXs', val); };
  @Input('fxFlexOffset.gt-sm') set offsetGtSm(val) { this._cacheInput('offsetGtSm', val); };
  @Input('fxFlexOffset.gt-md') set offsetGtMd(val) { this._cacheInput('offsetGtMd', val); };
  @Input('fxFlexOffset.gt-lg') set offsetGtLg(val) { this._cacheInput('offsetGtLg', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              renderer: Renderer2,
              @Optional() @SkipSelf() protected _container: LayoutDirective ) {
    super(monitor, elRef, renderer);


    this.watchParentFlow();
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['offset'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * Cleanup
   */
  ngOnDestroy() {
    super.ngOnDestroy();
    if (this._layoutWatcher) {
      this._layoutWatcher.unsubscribe();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('offset', 0 , (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /** The flex-direction of this element's host container. Defaults to 'row'. */
  protected _layout = 'row';

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  protected _layoutWatcher: Subscription;

  /**
   * If parent flow-direction changes, then update the margin property
   * used to offset
   */
  protected watchParentFlow() {
    if (this._container) {
      // Subscribe to layout immediate parent direction changes (if any)
      this._layoutWatcher = this._container.layout$.subscribe((direction) => {
        // `direction` === null if parent container does not have a `fxLayout`
        this._onLayoutChange(direction);
      });
    }
  }

  /**
   * Caches the parent container's 'flex-direction' and updates the element's style.
   * Used as a handler for layout change events from the parent flex container.
   */
  protected _onLayoutChange(direction?: string) {
    this._layout = direction || this._layout || 'row';
    this._updateWithValue();
  }

  /**
   * Using the current fxFlexOffset value, update the inline CSS
   * NOTE: this will assign `margin-left` if the parent flex-direction == 'row',
   *       otherwise `margin-top` is used for the offset.
   */
  protected _updateWithValue(value?: string|number) {
    value = value || this._queryInput('offset') || 0;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  protected _buildCSS(offset) {
    let isPercent = String(offset).indexOf('%') > -1;
    let isPx = String(offset).indexOf('px') > -1;
    if (!isPx && !isPercent && !isNaN(offset)) {
      offset = offset + '%';
    }

    // The flex-direction of this element's flex container. Defaults to 'row'.
    let layout = this._getFlowDirection(this.parentElement, true);
    return isFlowHorizontal(layout) ? {'margin-left': `${offset}`} : {'margin-top': `${offset}`};
  }
}
