import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer,
  SimpleChanges,
} from '@angular/core';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';

/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
@Directive({selector: '[fx-layout-wrap]'})
export class LayoutWrapDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: ResponsiveActivation;

  @Input('fx-layout-wrap') wrap: string = 'wrap';

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-layout-wrap.xs') wrapXs;
  @Input('fx-layout-wrap.gt-xs') wrapGtXs;
  @Input('fx-layout-wrap.sm') wrapSm;
  @Input('fx-layout-wrap.gt-sm') wrapGtSm;
  @Input('fx-layout-wrap.md') wrapMd;
  @Input('fx-layout-wrap.gt-md') wrapGtMd;
  @Input('fx-layout-wrap.lg') wrapLg;
  @Input('fx-layout-wrap.gt-lg') wrapGtLg;
  @Input('fx-layout-wrap.xl') wrapXl;

  constructor(monitor : MediaMonitor, elRef: ElementRef, renderer: Renderer) {
    super(monitor, elRef, renderer)
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    if (changes['wrap'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    let keyOptions = new KeyOptions('wrap', 'wrap');
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
    value = value || this.wrap || 'wrap';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }
    value = this._validateValue(value);

    this._applyStyleToElement(this._buildCSS(value));
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return { 'flex-wrap': value };
  }

  /**
   * Convert layout-wrap="<value>" to expected flex-wrap style
   */
  _validateValue(value) {
    switch (value.toLowerCase()) {
      case 'reverse':
      case 'wrap-reverse':
        value = 'wrap-reverse';
        break;

      case 'no':
      case 'none':
      case 'nowrap':
        value = 'nowrap';
        break;

      // All other values fallback to "wrap"
      default:
        value = 'wrap';
        break;
    }
    return value;
  }
}
