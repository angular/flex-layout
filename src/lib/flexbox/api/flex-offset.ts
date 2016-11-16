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
import {BaseFxDirective} from './base';


/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
@Directive({selector: '[fx-flex-offset]'})
export class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges,
                                                                       OnMediaQueryChanges {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  @Input('fx-flex-offset') offset: string|number;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-flex-offset.xs') offsetXs: string|number;
  @Input('fx-flex-offset.gt-xs') offsetGtXs: string|number;
  @Input('fx-flex-offset.sm') offsetSm: string|number;
  @Input('fx-flex-offset.gt-sm') offsetGtSm: string|number;
  @Input('fx-flex-offset.md') offsetMd: string|number;
  @Input('fx-flex-offset.gt-md') offsetGtMd: string|number;
  @Input('fx-flex-offset.lg') offsetLg: string|number;
  @Input('fx-flex-offset.gt-lg') offsetGtLg: string|number;
  @Input('fx-flex-offset.xl') offsetXl: string|number;

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
    if (changes['offset'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'offset', 0);
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


  _updateWithValue(value?: string|number) {
    value = value || this.offset || 0;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    this._applyStyleToElement(this._buildCSS(value));
  }

  _buildCSS(offset) {
    let isPercent = String(offset).indexOf('%') > -1;
    let isPx = String(offset).indexOf('px') > -1;
    if (!isPx && !isPercent && !isNaN(offset))
      offset = offset + '%';

    return {'margin-left': `${offset}`};
  }
}
