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
import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFxDirective} from './base';


/**
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
@Directive({selector: '[fx-layout-wrap]'})
export class LayoutWrapDirective extends BaseFxDirective implements OnInit, OnChanges,
                                                                       OnMediaQueryChanges,
                                                                       OnDestroy {
  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

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

  constructor(private _mqa: MediaQueryAdapter, elRef: ElementRef, renderer: Renderer) {
    super(elRef, renderer)
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;

    if (changes['wrap'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'wrap', 'wrap');
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    this._updateWithValue(changes.current.value);
  }

  ngOnDestroy() {}

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
