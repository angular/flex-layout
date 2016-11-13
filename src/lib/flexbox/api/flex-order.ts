import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChanges,
} from '@angular/core';
import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFlexLayoutDirective} from './abstract';

/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
@Directive({selector: '[fx-flex-order]'})
export class FlexOrderDirective extends BaseFlexLayoutDirective implements OnInit, OnChanges,
                                                                      OnMediaQueryChanges {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

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

  constructor(private _mqa: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * For @Input changes on the current mq activation property, delegate to the onLayoutChange()
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;

    if (changes['order'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'order', '1');
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithValue(changes.current.value);
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
