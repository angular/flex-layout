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
  [fxFlexOrder],
  [fxFlexOrder.xs]
  [fxFlexOrder.gt-xs],
  [fxFlexOrder.sm],
  [fxFlexOrder.gt-sm]
  [fxFlexOrder.md],
  [fxFlexOrder.gt-md]
  [fxFlexOrder.lg],
  [fxFlexOrder.gt-lg],
  [fxFlexOrder.xl]
`})
export class FlexOrderDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  @Input('fxFlexOrder')       set order(val)     { this._cacheInput('order', val); }
  @Input('fxFlexOrder.xs')    set orderXs(val)   { this._cacheInput('orderXs', val); }
  @Input('fxFlexOrder.gt-xs') set orderGtXs(val) { this._cacheInput('orderGtXs', val); };
  @Input('fxFlexOrder.sm')    set orderSm(val)   { this._cacheInput('orderSm', val); };
  @Input('fxFlexOrder.gt-sm') set orderGtSm(val) { this._cacheInput('orderGtSm', val); };
  @Input('fxFlexOrder.md')    set orderMd(val)   { this._cacheInput('orderMd', val); };
  @Input('fxFlexOrder.gt-md') set orderGtMd(val) { this._cacheInput('orderGtMd', val); };
  @Input('fxFlexOrder.lg')    set orderLg(val)   { this._cacheInput('orderLg', val); };
  @Input('fxFlexOrder.gt-lg') set orderGtLg(val) { this._cacheInput('orderGtLg', val); };
  @Input('fxFlexOrder.xl')    set orderXl(val)   { this._cacheInput('orderXl', val); };

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
