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
import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive({selector: '[fx-flex-order]'})
export class FlexOrderDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: ResponsiveActivation;

  @Input('fx-flex-order') order;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-flex-order.xs') orderXs;
  @Input('fx-flex-order.gt-xs') orderGtXs;
  @Input('fx-flex-order.sm') orderSm;
  @Input('fx-flex-order.gt-sm') orderGtSm;
  @Input('fx-flex-order.md') orderMd;
  @Input('fx-flex-order.gt-md') orderGtMd;
  @Input('fx-flex-order.lg') orderLg;
  @Input('fx-flex-order.gt-lg') orderGtLg;
  @Input('fx-flex-order.xl') orderXl;

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
    let keyOptions = new KeyOptions('order', '1');
    this._mqActivation = new ResponsiveActivation(this, keyOptions, (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }

  ngOnDestroy() {
    this._mqActivation.destroy();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  _updateWithValue(value?: string) {
    value = value || this.order || '1';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }


  _buildCSS(value) {
    value = parseInt(value, 10);
    return {order: isNaN(value) ? 0 : value};
  }
}
