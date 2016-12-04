import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer,
  SimpleChanges,
  Self,
  Optional
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';

import {ShowDirective} from "./show";
import {LayoutDirective} from './layout';

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: '[fx-hide]' })
export class HideDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Original dom Elements CSS display style
   */
  private _display = 'flex';

  /**
   * MediaQuery Activation Tracker
   */
  private _mqActivation: ResponsiveActivation;

  /**
    * Subscription to the parent flex container's layout changes.
    * Stored so we can unsubscribe when this directive is destroyed.
    */
  private _layoutWatcher : Subscription;

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
      monitor : MediaMonitor,
      @Optional() @Self() private _layout: LayoutDirective,
      @Optional() @Self() private _showDirective : ShowDirective,
      protected elRef: ElementRef,
      protected renderer: Renderer) {
    super(monitor, elRef, renderer);

    if (_layout) {
      /**
       * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
       * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
       */
      this._layoutWatcher = _layout.layout$.subscribe(() => this._updateWithValue());
    }
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
    if (changes['hide'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    let keyOptions = new KeyOptions('hide', true);
    this._mqActivation = new ResponsiveActivation(this, keyOptions, (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }


  ngOnDestroy() {
    this._mqActivation.destroy();
    if (this._layoutWatcher) {
      this._layoutWatcher.unsubscribe();
    }
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

