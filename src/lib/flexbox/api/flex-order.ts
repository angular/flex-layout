import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer,
  SimpleChanges,
} from '@angular/core';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive({selector: `
  [fx-flex-order],
  [fx-flex-order.xs]
  [fx-flex-order.gt-xs],
  [fx-flex-order.sm],
  [fx-flex-order.gt-sm]
  [fx-flex-order.md],
  [fx-flex-order.gt-md]
  [fx-flex-order.lg],
  [fx-flex-order.gt-lg],
  [fx-flex-order.xl]
`})
export class FlexOrderDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  @Input('fx-flex-order')       set order(val)     { this._cacheInput('order', val); }
  @Input('fx-flex-order.xs')    set orderXs(val)   { this._cacheInput('orderXs', val); }
  @Input('fx-flex-order.gt-xs') set orderGtXs(val) { this._cacheInput('orderGtXs', val); };
  @Input('fx-flex-order.sm')    set orderSm(val)   { this._cacheInput('orderSm', val); };
  @Input('fx-flex-order.gt-sm') set orderGtSm(val) { this._cacheInput('orderGtSm', val); };
  @Input('fx-flex-order.md')    set orderMd(val)   { this._cacheInput('orderMd', val); };
  @Input('fx-flex-order.gt-md') set orderGtMd(val) { this._cacheInput('orderGtMd', val); };
  @Input('fx-flex-order.lg')    set orderLg(val)   { this._cacheInput('orderLg', val); };
  @Input('fx-flex-order.gt-lg') set orderGtLg(val) { this._cacheInput('orderGtLg', val); };
  @Input('fx-flex-order.xl')    set orderXl(val)   { this._cacheInput('orderXl', val); };

  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer) {
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
    this._listenForMediaQueryChanges('order', '1', (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  private _updateWithValue(value?: string) {
    value = value || this._queryInput("order") || '1';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }


  private _buildCSS(value) {
    value = parseInt(value, 10);
    return {order: isNaN(value) ? 0 : value};
  }
}
