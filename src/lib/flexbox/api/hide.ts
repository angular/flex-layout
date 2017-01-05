/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
  Renderer,
  SimpleChanges,
  Self,
  Optional
} from '@angular/core';

import {Subscription} from 'rxjs/Subscription';

import {BaseFxDirective} from './base';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

import {LayoutDirective} from './layout';

/**
 * 'show' Layout API directive
 *
 */
@Directive({selector: `
  [fxHide],
  [fxHide.xs]
  [fxHide.gt-xs],
  [fxHide.sm],
  [fxHide.gt-sm]
  [fxHide.md],
  [fxHide.gt-md]
  [fxHide.lg],
  [fxHide.gt-lg],
  [fxHide.xl]
`})
export class HideDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
  /**
   * Original dom Elements CSS display style
   */
  private _display = 'flex';

  /**
    * Subscription to the parent flex container's layout changes.
    * Stored so we can unsubscribe when this directive is destroyed.
    */
  private _layoutWatcher: Subscription;

  @Input('fxHide')       set hide(val)     { this._cacheInput("hide", val); }
  @Input('fxHide.xs')    set hideXs(val)   { this._cacheInput('hideXs', val); }
  @Input('fxHide.gt-xs') set hideGtXs(val) { this._cacheInput('hideGtXs', val); };
  @Input('fxHide.sm')    set hideSm(val)   { this._cacheInput('hideSm', val); };
  @Input('fxHide.gt-sm') set hideGtSm(val) { this._cacheInput('hideGtSm', val); };
  @Input('fxHide.md')    set hideMd(val)   { this._cacheInput('hideMd', val); };
  @Input('fxHide.gt-md') set hideGtMd(val) { this._cacheInput('hideGtMd', val); };
  @Input('fxHide.lg')    set hideLg(val)   { this._cacheInput('hideLg', val); };
  @Input('fxHide.gt-lg') set hideGtLg(val) { this._cacheInput('hideGtLg', val); };
  @Input('fxHide.xl')    set hideXl(val)   { this._cacheInput('hideXl', val); };

  /**
   *
   */
  constructor(
      monitor: MediaMonitor,
      @Optional() @Self() private _layout: LayoutDirective,
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


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fxHide')
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
    this._listenForMediaQueryChanges('hide', true, (changes: MediaChange) => {
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
  private _updateWithValue(value?: string|number|boolean) {
    value = value || this._queryInput("hide") || true;
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    let shouldHide = this._validateTruthy(value);
    this._applyStyleToElement(this._buildCSS(shouldHide));
  }


  /**
   * Build the CSS that should be assigned to the element instance
   */
  private _buildCSS(value) {
    return {'display': value ? 'none' :  this._display };
  }

  /**
   * Validate the value to NOT be FALSY
   */
  private _validateTruthy(value) {
    return FALSY.indexOf(value) === -1;
  }
}


const FALSY = ['false', false, 0];

