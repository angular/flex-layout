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
import {HideDirective} from './hide';


const FALSY = ['false', false, 0];

/**
 * 'show' Layout API directive
 *
 */
@Directive({
  selector: `
  [fxShow],
  [fxShow.xs],
  [fxShow.gt-xs],
  [fxShow.sm],
  [fxShow.gt-sm],
  [fxShow.md],
  [fxShow.gt-md],
  [fxShow.lg],
  [fxShow.gt-lg],
  [fxShow.xl]
`
})
export class ShowDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Subscription to the parent flex container's layout changes.
   * Stored so we can unsubscribe when this directive is destroyed.
   */
  private _layoutWatcher: Subscription;

  @Input('fxShow')       set show(val) {
    this._cacheInput("show", val);
  }

  @Input('fxShow.xs')    set showXs(val) {
    this._cacheInput('showXs', val);
  }

  @Input('fxShow.gt-xs') set showGtXs(val) {
    this._cacheInput('showGtXs', val);
  };

  @Input('fxShow.sm')    set showSm(val) {
    this._cacheInput('showSm', val);
  };

  @Input('fxShow.gt-sm') set showGtSm(val) {
    this._cacheInput('showGtSm', val);
  };

  @Input('fxShow.md')    set showMd(val) {
    this._cacheInput('showMd', val);
  };

  @Input('fxShow.gt-md') set showGtMd(val) {
    this._cacheInput('showGtMd', val);
  };

  @Input('fxShow.lg')    set showLg(val) {
    this._cacheInput('showLg', val);
  };

  @Input('fxShow.gt-lg') set showGtLg(val) {
    this._cacheInput('showGtLg', val);
  };

  @Input('fxShow.xl')    set showXl(val) {
    this._cacheInput('showXl', val);
  };

  /**
   *
   */
  constructor(monitor: MediaMonitor,
              @Optional() @Self() private _layout: LayoutDirective,
              @Optional() @Self() private _hide: HideDirective,
              protected elRef: ElementRef,
              protected renderer: Renderer) {

    super(monitor, elRef, renderer);

    this._display = this._getDisplayStyle();  // re-invoke override to use `this._layout`
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
   * unless it was already explicitly defined.
   */
  protected _getDisplayStyle(): string {
    let element: HTMLElement = this._elementRef.nativeElement;
    return (element.style as any)['display'] || (this._layout ? "flex" : "block");
  }


  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fxShow')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['show'] != null || this._mqActivation) {
      this._updateWithValue();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    let value = this._getDefaultVal("show", true);

    // Build _mqActivation controller
    this._listenForMediaQueryChanges('show', value, (changes: MediaChange) => {
      if (!this._delegateToHide(changes)) {
        this._updateWithValue(changes.value);
      }
    });

    if (!this._delegateToHide()) {
      this._updateWithValue();
    }
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
   * If deactiving Show, then delegate action to the Hide directive if it is
   * specified on same element.
   */
  protected _delegateToHide(changes?: MediaChange) {
    if (this._hide) {
      let delegate = (changes && !changes.matches) || (!changes && !this.hasKeyValue('show'));
      if (delegate) {
        this._hide.ngOnChanges({});
        return true;
      }
    }
    return false;
  }

  /** Validate the visibility value and then update the host's inline display style */
  private _updateWithValue(value?: string|number|boolean) {
    value = value || this._getDefaultVal("show", true);
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    let shouldShow = this._validateTruthy(value);
    this._applyStyleToElement(this._buildCSS(shouldShow));
  }


  /** Build the CSS that should be assigned to the element instance */
  private _buildCSS(show) {
    return {'display': show ? this._display : 'none'};
  }

  /**  Validate the to be not FALSY */
  _validateTruthy(show) {
    return (FALSY.indexOf(show) == -1);
  }
}
