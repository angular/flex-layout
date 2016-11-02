import {
  Directive, Renderer, ElementRef, Input,
  SimpleChanges, Optional, OnChanges, OnDestroy, OnInit,
} from '@angular/core';

import { BaseStyleDirective } from "./abstract";
import {
  MediaQueryAdapter, MediaQueryChanges,
  OnMediaQueryChanges, MediaQueryActivation
} from "../media-query/media-query-adapter";

import { isDefined, delay } from '../../utils/global';


const FALSY = [ "false", "0", false,  0];

/**
 * 'show' Layout API directive
 *
 */
@Directive({
  selector: '[fl-show]'
})
export class ShowDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges {

  /**
   * Original dom Elements CSS display style
   */
  private _display = "flex";

  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation : MediaQueryActivation;

  /**
   * Default layout property with default visible === true
   */
  @Input('fl-show')        show = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fl-show.xs')     showXs;
  @Input('fl-show.gt-xs')  showGtXs;
  @Input('fl-show.sm')     showSm;
  @Input('fl-show.gt-sm')  showGtSm;
  @Input('fl-show.md')     showMd;
  @Input('fl-show.gt-md')  showGtMd;
  @Input('fl-show.lg')     showLg;
  @Input('fl-show.gt-lg')  showGtLg;
  @Input('fl-show.xl')     showXl;

  /**
   *
   */
  constructor(private _$mq: MediaQueryAdapter, protected elRef: ElementRef, protected renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fl-show')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges( changes:SimpleChanges ) {
    let activated = this._mqActivation;
    let activationChange = activated && isDefined(changes[activated.activatedInputKey]);
    if ( isDefined(changes['show'])  || activationChange ) {
      this._updateWithValue( );
    }

  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    this._mqActivation = this._$mq.attach(this, "show", "true");
    this._updateWithValue();
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  ngOnMediaQueryChanges(changes: MediaQueryChanges) {
    // console.log("ShowDirective::ngOnMediaChanges()");

    delay(()=>{
      this._updateWithValue( changes.current.value );
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the visibility value and then update the host's inline display style
   */
  _updateWithValue(value?:string|number|boolean) {
    value = value || this.show || true;
    if (  isDefined(this._mqActivation) ) {
      value = this._mqActivation.activatedInput;
    }
    value = this._validateValue(value);

    // Update styles and announce to subscribers the *new* direction
    this._updateStyle(this._buildCSS( value ));
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(isFalsy) {
    return {
      'display' : !isFalsy ? this._display : 'none'
    };
  }

  /**
   * Validate the value to be not FALSY
   */
  _validateValue(value) {
    // console.log(`ShowDirective::_validateValue( ${value} )`);
    return isDefined(FALSY.find(x => x === value ));
  }

}



/**
 * 'show' Layout API directive
 *
 */
@Directive({
  selector: '[fl-hide]'
})
export class HideDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges {
  /**
   * Original dom Elements CSS display style
   */
  private _display = "flex";

  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation : MediaQueryActivation;

  /**
   * Default layout property with default visible === true
   */
  @Input('fl-hide')        hide = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('fl-hide.xs')     hideXs;
  @Input('fl-hide.gt-xs')  hideGtXs;
  @Input('fl-hide.sm')     hideSm;
  @Input('fl-hide.gt-sm')  hideGtSm;
  @Input('fl-hide.md')     hideMd;
  @Input('fl-hide.gt-md')  hideGtMd;
  @Input('fl-hide.lg')     hideLg;
  @Input('fl-hide.gt-lg')  hideGtLg;
  @Input('fl-hide.xl')     hideXl;

  /**
   *
   */
  constructor(private _$mq: MediaQueryAdapter, protected elRef: ElementRef, protected renderer: Renderer) {
    super(elRef, renderer);
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fl-hide')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges( changes?:SimpleChanges ) {
    let activated = this._mqActivation;
    let activationChange = activated && isDefined(changes[activated.activatedInputKey]);

    if ( isDefined(changes['hide'])  || activationChange ) {
      this._updateWithValue( );
    }

  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {

    this._mqActivation = this._$mq.attach(this, "hide", "true");
    this._updateWithValue( );
  }

  /**
   *  Special mql callback used by MediaQueryActivation when a mql event occurs
   */
  ngOnMediaQueryChanges(changes: MediaQueryChanges) {
    // console.log("HideDirective::ngOnMediaChanges()");

    delay(()=>{
      this._updateWithValue( changes.current.value );
    });
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the visibility value and then update the host's inline display style
   */
  _updateWithValue(value?:string|number|boolean) {
    let key = "";

    value = value || this.hide || true;

    if (  isDefined(this._mqActivation) ) {
      value = this._mqActivation.activatedInput;
      key = this._mqActivation.activatedInputKey;
    }
    value = this._validateValue(value);

    // Update styles and announce to subscribers the *new* direction
    this._updateStyle(this._buildCSS( value ));
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  _buildCSS(value) {
    return {
      'display' : value ? 'none' : this._display
    };
  }

  /**
   * Validate the value to be FALSY
   */
  _validateValue(value) {
    // console.log(`HideDirective::_validateValue( ${value} )`);
    return !isDefined(FALSY.find(x => x === value ));
  }

}



function calculateDisplayStyle(elRef: ElementRef):string {
  let domEl = elRef.nativeElement;
  return window.getComputedStyle(domEl).display;
}
