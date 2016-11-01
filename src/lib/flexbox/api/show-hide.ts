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
  selector: '[ng-show]'
})
export class ShowDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {

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
  @Input('ng-show')        show = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('ng-show.xs')     showXs;
  @Input('ng-show.gt-xs')  showGtXs;
  @Input('ng-show.sm')     showSm;
  @Input('ng-show.gt-sm')  showGtSm;
  @Input('ng-show.md')     showMd;
  @Input('ng-show.gt-md')  showGtMd;
  @Input('ng-show.lg')     showLg;
  @Input('ng-show.gt-lg')  showGtLg;
  @Input('ng-show.xl')     showXl;

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
   * Default to use the non-responsive Input value ('ng-show')
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
    // console.log(`ShowDirective::_buildCss( ${isFalsy} )`);
    return this._modernizer({
      'display' : !isFalsy ? this._display : 'none'
    });
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
  selector: '[ng-hide]'
})
export class HideDirective extends BaseStyleDirective implements OnInit, OnChanges, OnMediaQueryChanges, OnDestroy {
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
  @Input('ng-hide')        hide = true;

  // *******************************************************
  // Optional input variations to support mediaQuery triggers
  // *******************************************************

  @Input('ng-hide.xs')     hideXs;
  @Input('ng-hide.gt-xs')  hideGtXs;
  @Input('ng-hide.sm')     hideSm;
  @Input('ng-hide.gt-sm')  hideGtSm;
  @Input('ng-hide.md')     hideMd;
  @Input('ng-hide.gt-md')  hideGtMd;
  @Input('ng-hide.lg')     hideLg;
  @Input('ng-hide.gt-lg')  hideGtLg;
  @Input('ng-hide.xl')     hideXl;

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
   * Default to use the non-responsive Input value ('ng-hide')
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
    // console.log(`HideDirective::_buildCss( ${value} )`);

    return this._modernizer({
      'display' : value ? 'none' : this._display
    });
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
