import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer,
  SimpleChanges,
  Self,
  Optional,
} from '@angular/core';

import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';
import {BaseFxDirective} from './base';
import {ShowDirective} from "./show";

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: '[fx-hide]'})
export class HideDirective extends BaseFxDirective implements OnInit, OnChanges,
                                                                 OnMediaQueryChanges {
  /**
   * Original dom Elements CSS display style
   */
  private _display = 'flex';

  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: MediaQueryActivation;

  /**
   * Default layout property with default visible === true
   */
  @Input('fx-hide') hide = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-hide.xs') hideXs;
  @Input('fx-hide.gt-xs') hideGtXs;
  @Input('fx-hide.sm') hideSm;
  @Input('fx-hide.gt-sm') hideGtSm;
  @Input('fx-hide.md') hideMd;
  @Input('fx-hide.gt-md') hideGtMd;
  @Input('fx-hide.lg') hideLg;
  @Input('fx-hide.gt-lg') hideGtLg;
  @Input('fx-hide.xl') hideXl;

  /**
   *
   */
  constructor(
      private _mqa: MediaQueryAdapter, @Optional() @Self() private _showDirective : ShowDirective,
      protected elRef: ElementRef, protected renderer: Renderer) {
    super(elRef, renderer);
  }

  /**
   * Does the current element also use the fx-show API ?
   */
  protected get usesShowAPI() {
    return !!this._showDirective;
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fx-hide')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;

    if (changes['hide'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'hide', true );
    this._updateWithValue();
  }

  /** Special mql callback used by MediaQueryActivation when a mql event occurs */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    setTimeout(() => this._updateWithValue(changes.current.value), 1);
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the visibility value and then update the host's inline display style
   */
  _updateWithValue(value?: string|number|boolean) {
    value = value || this.hide || true;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    let shouldHide = this._validateTruthy(value);
    if ( shouldHide || !this.usesShowAPI ) {
      this._applyStyleToElement(this._buildCSS(shouldHide));
    }
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return {'display': value ? 'none' :  this._display };
  }

  /**
   * Validate the value to NOT be FALSY
   */
  _validateTruthy(value) {
    return FALSY.indexOf(value) === -1;
  }
}


const FALSY = ['false', false, 0];

