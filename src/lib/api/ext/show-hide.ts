/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges,
  Self,
  Optional
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from '../core/base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {LayoutDirective} from '../flexbox/layout';

const FALSY = ['false', false, 0];

/**
 * For fxHide selectors, we invert the 'value'
 * and assign to the equivalent fxShow selector cache
 *  - When 'hide' === '' === true, do NOT show the element
 *  - When 'hide' === false or 0... we WILL show the element
 */
export function negativeOf(hide: any) {
  return (hide === '') ? false :
         ((hide === 'false') || (hide === 0)) ? true : !hide;
}

/**
 * 'show' Layout API directive
 *
 */
@Directive({
  selector: `
  [fxShow],
  [fxShow.xs], [fxShow.sm], [fxShow.md], [fxShow.lg], [fxShow.xl],
  [fxShow.lt-sm], [fxShow.lt-md], [fxShow.lt-lg], [fxShow.lt-xl],
  [fxShow.gt-xs], [fxShow.gt-sm], [fxShow.gt-md], [fxShow.gt-lg],
  [fxHide],
  [fxHide.xs], [fxHide.sm], [fxHide.md], [fxHide.lg], [fxHide.xl],
  [fxHide.lt-sm], [fxHide.lt-md], [fxHide.lt-lg], [fxHide.lt-xl],
  [fxHide.gt-xs], [fxHide.gt-sm], [fxHide.gt-md], [fxHide.gt-lg]
`
})
export class ShowHideDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  protected _layoutWatcher: Subscription;

  /* tslint:disable */
  @Input('fxShow')       set show(val) {  this._cacheInput('show', val);  }
  @Input('fxShow.xs')    set showXs(val) {this._cacheInput('showXs', val);}
  @Input('fxShow.sm')    set showSm(val) {this._cacheInput('showSm', val); };
  @Input('fxShow.md')    set showMd(val) {this._cacheInput('showMd', val); };
  @Input('fxShow.lg')    set showLg(val) {this._cacheInput('showLg', val); };
  @Input('fxShow.xl')    set showXl(val) {this._cacheInput('showXl', val); };

  @Input('fxShow.lt-sm') set showLtSm(val) { this._cacheInput('showLtSm', val); };
  @Input('fxShow.lt-md') set showLtMd(val) { this._cacheInput('showLtMd', val); };
  @Input('fxShow.lt-lg') set showLtLg(val) { this._cacheInput('showLtLg', val); };
  @Input('fxShow.lt-xl') set showLtXl(val) { this._cacheInput('showLtXl', val); };

  @Input('fxShow.gt-xs') set showGtXs(val) {this._cacheInput('showGtXs', val); };
  @Input('fxShow.gt-sm') set showGtSm(val) {this._cacheInput('showGtSm', val); };
  @Input('fxShow.gt-md') set showGtMd(val) {this._cacheInput('showGtMd', val); };
  @Input('fxShow.gt-lg') set showGtLg(val) {this._cacheInput('showGtLg', val); };

  @Input('fxHide')       set hide(val) {this._cacheInput('show', negativeOf(val));}
  @Input('fxHide.xs')    set hideXs(val) {this._cacheInput('showXs', negativeOf(val));}
  @Input('fxHide.sm')    set hideSm(val) {this._cacheInput('showSm', negativeOf(val)); };
  @Input('fxHide.md')    set hideMd(val) {this._cacheInput('showMd', negativeOf(val)); };
  @Input('fxHide.lg')    set hideLg(val) {this._cacheInput('showLg', negativeOf(val)); };
  @Input('fxHide.xl')    set hideXl(val) {this._cacheInput('showXl', negativeOf(val)); };

  @Input('fxHide.lt-sm') set hideLtSm(val) { this._cacheInput('showLtSm', negativeOf(val)); };
  @Input('fxHide.lt-md') set hideLtMd(val) { this._cacheInput('showLtMd', negativeOf(val)); };
  @Input('fxHide.lt-lg') set hideLtLg(val) { this._cacheInput('showLtLg', negativeOf(val)); };
  @Input('fxHide.lt-xl') set hideLtXl(val) { this._cacheInput('showLtXl', negativeOf(val)); };

  @Input('fxHide.gt-xs') set hideGtXs(val) {this._cacheInput('showGtXs', negativeOf(val)); };
  @Input('fxHide.gt-sm') set hideGtSm(val) {this._cacheInput('showGtSm', negativeOf(val)); };
  @Input('fxHide.gt-md') set hideGtMd(val) {this._cacheInput('showGtMd', negativeOf(val)); };
  @Input('fxHide.gt-lg') set hideGtLg(val) {this._cacheInput('showGtLg', negativeOf(val)); };

  /* tslint:enable */
  /**
   *
   */
  constructor(monitor: MediaMonitor,
              @Optional() @Self() protected _layout: LayoutDirective,
              protected elRef: ElementRef,
              protected renderer: Renderer2) {

    super(monitor, elRef, renderer);

    if (_layout) {
      /**
       * The Layout can set the display:flex (and incorrectly affect the Hide/Show directives.
       * Whenever Layout [on the same element] resets its CSS, then update the Hide/Show CSS
       */
      this._layoutWatcher = _layout.layout$.subscribe(() => this._updateWithValue());
    }
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * Override accessor to the current HTMLElement's `display` style
   * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
   * unless it was already explicitly specified inline or in a CSS stylesheet.
   */
  protected _getDisplayStyle(): string {
    return this._layout ? 'flex' : super._getDisplayStyle();
  }


  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fxShow')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.hasInitialized && (changes['show'] != null || this._mqActivation)) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    let value = this._getDefaultVal('show', true);
    // Build _mqActivation controller
    this._listenForMediaQueryChanges('show', value, (changes: MediaChange) => {
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

  /** Validate the visibility value and then update the host's inline display style */
  protected _updateWithValue(value?: string|number|boolean) {
    value = value || this._getDefaultVal('show', true);
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    let shouldShow = this._validateTruthy(value);
    this._applyStyleToElement(this._buildCSS(shouldShow));
  }


  /** Build the CSS that should be assigned to the element instance */
  protected _buildCSS(show) {
    return {'display': show ? this._display : 'none'};
  }

  /**  Validate the to be not FALSY */
  _validateTruthy(show) {
    return (FALSY.indexOf(show) == -1);
  }
}
