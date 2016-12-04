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
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
@Directive({selector: '[fx-flex-offset]'})
export class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: ResponsiveActivation;

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

  constructor(monitor : MediaMonitor,  elRef: ElementRef, renderer: Renderer) {
    super(monitor, elRef, renderer);
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
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    let keyOptions = new KeyOptions('offset', 0 );
    this._mqActivation = new ResponsiveActivation(this, keyOptions, (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
  }

  ngOnDestroy() {
    this._mqActivation.destroy();
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
