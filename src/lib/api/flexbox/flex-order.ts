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
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import {BaseFxDirective} from '../core/base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive({selector: `
  [fxFlexOrder],
  [fxFlexOrder.xs], [fxFlexOrder.sm], [fxFlexOrder.md], [fxFlexOrder.lg], [fxFlexOrder.xl],
  [fxFlexOrder.lt-sm], [fxFlexOrder.lt-md], [fxFlexOrder.lt-lg], [fxFlexOrder.lt-xl],
  [fxFlexOrder.gt-xs], [fxFlexOrder.gt-sm], [fxFlexOrder.gt-md], [fxFlexOrder.gt-lg]
`})
export class FlexOrderDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /* tslint:disable */
  @Input('fxFlexOrder')       set order(val)     { this._cacheInput('order', val); }
  @Input('fxFlexOrder.xs')    set orderXs(val)   { this._cacheInput('orderXs', val); }
  @Input('fxFlexOrder.sm')    set orderSm(val)   { this._cacheInput('orderSm', val); };
  @Input('fxFlexOrder.md')    set orderMd(val)   { this._cacheInput('orderMd', val); };
  @Input('fxFlexOrder.lg')    set orderLg(val)   { this._cacheInput('orderLg', val); };
  @Input('fxFlexOrder.xl')    set orderXl(val)   { this._cacheInput('orderXl', val); };

  @Input('fxFlexOrder.gt-xs') set orderGtXs(val) { this._cacheInput('orderGtXs', val); };
  @Input('fxFlexOrder.gt-sm') set orderGtSm(val) { this._cacheInput('orderGtSm', val); };
  @Input('fxFlexOrder.gt-md') set orderGtMd(val) { this._cacheInput('orderGtMd', val); };
  @Input('fxFlexOrder.gt-lg') set orderGtLg(val) { this._cacheInput('orderGtLg', val); };

  @Input('fxFlexOrder.lt-sm') set orderLtSm(val) { this._cacheInput('orderLtSm', val); };
  @Input('fxFlexOrder.lt-md') set orderLtMd(val) { this._cacheInput('orderLtMd', val); };
  @Input('fxFlexOrder.lt-lg') set orderLtLg(val) { this._cacheInput('orderLtLg', val); };
  @Input('fxFlexOrder.lt-xl') set orderLtXl(val) { this._cacheInput('orderLtXl', val); };

  /* tslint:enable */
  constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2) {
    super(monitor, elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, see onMediaQueryChanges()
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('order', '0', (changes: MediaChange) => {
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  protected _updateWithValue(value?: string) {
    value = value || this._queryInput('order') || '0';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }


  protected _buildCSS(value) {
    value = parseInt(value, 10);
    return {order: isNaN(value) ? 0 : value};
  }
}
