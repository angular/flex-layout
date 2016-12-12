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
import {addResponsiveAliases} from '../../utils/add-alias';

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: addResponsiveAliases('fx-hide') })
export class HideDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Original dom Elements CSS display style
   */
  private _display = 'flex';

  /**
    * Subscription to the parent flex container's layout changes.
    * Stored so we can unsubscribe when this directive is destroyed.
    */
  private _layoutWatcher : Subscription;

  @Input('fx-hide')       set hide(val)     { this._cacheInput("hide", val); }
  @Input('fx-hide.xs')    set hideXs(val)   { this._cacheInput('hideXs', val); }
  @Input('fx-hide.gt-xs') set hideGtXs(val) { this._cacheInput('hideGtXs', val); };
  @Input('fx-hide.sm')    set hideSm(val)   { this._cacheInput('hideSm', val); };
  @Input('fx-hide.gt-sm') set hideGtSm(val) { this._cacheInput('hideGtSm', val); };
  @Input('fx-hide.md')    set hideMd(val)   { this._cacheInput('hideMd', val); };
  @Input('fx-hide.gt-md') set hideGtMd(val) { this._cacheInput('hideGtMd', val); };
  @Input('fx-hide.lg')    set hideLg(val)   { this._cacheInput('hideLg', val); };
  @Input('fx-hide.gt-lg') set hideGtLg(val) { this._cacheInput('hideGtLg', val); };
  @Input('fx-hide.xl')    set hideXl(val)   { this._cacheInput('hideXl', val); };

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
    this._listenForMediaQueryChanges('hide', true, (changes: MediaChange) =>{
      this._updateWithValue(changes.value);
    });
    this._updateWithValue();
  }


  ngOnDestroy() {
    super.ngOnDestroy();
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
    value = value || this._queryInput("hide") || true;
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

