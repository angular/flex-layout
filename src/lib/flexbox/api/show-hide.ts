import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer, SimpleChanges,} from '@angular/core';

import {MediaQueryActivation} from '../media-query/media-query-activation';
import {MediaQueryAdapter} from '../media-query/media-query-adapter';
import {MediaQueryChanges, OnMediaQueryChanges} from '../media-query/media-query-changes';

import {BaseFlexLayoutDirective} from './abstract';


const FALSY = ['false', '0', false, 0];

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: '[fx-show]'})
export class ShowDirective extends BaseFlexLayoutDirective implements OnInit, OnChanges,
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
  @Input('fx-show') show = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fx-show.xs') showXs;
  @Input('fx-show.gt-xs') showGtXs;
  @Input('fx-show.sm') showSm;
  @Input('fx-show.gt-sm') showGtSm;
  @Input('fx-show.md') showMd;
  @Input('fx-show.gt-md') showGtMd;
  @Input('fx-show.lg') showLg;
  @Input('fx-show.gt-lg') showGtLg;
  @Input('fx-show.xl') showXl;

  /**
   *
   */
  constructor(
      private _mqa: MediaQueryAdapter, protected elRef: ElementRef, protected renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fx-show')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    let activated = this._mqActivation;
    let activationChange = activated && changes[activated.activatedInputKey] != null;
    if (changes['show'] != null || activationChange) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._mqa.attach(this, 'show', 'true');
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  onMediaQueryChanges(changes: MediaQueryChanges) {
    setTimeout(() => this._updateWithValue(changes.current.value), 1);
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /** Validate the visibility value and then update the host's inline display style */
  _updateWithValue(value?: string|number|boolean) {
    value = value || this.show || true;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }
    value = this._validateValue(value);

    // Update styles and announce to subscribers the *new* direction
    this._applyStyleToElement(this._buildCSS(value));
  }


  /** Build the CSS that should be assigned to the element instance */
  _buildCSS(isFalsy) {
    return {'display': !isFalsy ? this._display : 'none'};
  }

  /** Validate the value to be not FALSY */
  _validateValue(value) {
    return FALSY.find(x => x === value) != null;
  }
}


/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: '[fx-hide]'})
export class HideDirective extends BaseFlexLayoutDirective implements OnInit, OnChanges,
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
      private _mqa: MediaQueryAdapter, protected elRef: ElementRef, protected renderer: Renderer) {
    super(elRef, renderer);
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
    this._mqActivation = this._mqa.attach(this, 'hide', 'true');
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
    let key = '';

    value = value || this.hide || true;

    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }
    value = this._validateValue(value);

    // Update styles and announce to subscribers the *new* direction
    this._applyStyleToElement(this._buildCSS(value));
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return {'display': value ? 'none' : this._display};
  }

  /**
   * Validate the value to be FALSY
   */
  _validateValue(value) {
    // console.log(`HideDirective::_validateValue( ${value} )`);
    return FALSY.find(x => x === value) == null;
  }
}
