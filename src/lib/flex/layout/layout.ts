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
  SimpleChanges,
} from '@angular/core';
import {BaseFxDirective, MediaChange, MediaMonitor, StyleUtils} from '@angular/flex-layout/core';
import {Observable, ReplaySubject} from 'rxjs';

import {buildLayoutCSS} from '../../utils/layout-validator';

export type Layout = {
  direction: string;
  wrap: boolean;
};

/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
@Directive({selector: `
  [fxLayout],
  [fxLayout.xs], [fxLayout.sm], [fxLayout.md], [fxLayout.lg], [fxLayout.xl],
  [fxLayout.lt-sm], [fxLayout.lt-md], [fxLayout.lt-lg], [fxLayout.lt-xl],
  [fxLayout.gt-xs], [fxLayout.gt-sm], [fxLayout.gt-md], [fxLayout.gt-lg]
`})
export class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {

  /**
   * Create Observable for nested/child 'flex' directives. This allows
   * child flex directives to subscribe/listen for flexbox direction changes.
   */
  protected _announcer: ReplaySubject<Layout>;

  /**
   * Publish observer to enabled nested, dependent directives to listen
   * to parent 'layout' direction changes
   */
  layout$: Observable<Layout>;

  /* tslint:disable */
  @Input('fxLayout')       set layout(val)     { this._cacheInput('layout', val); };
  @Input('fxLayout.xs')    set layoutXs(val)   { this._cacheInput('layoutXs', val); };
  @Input('fxLayout.sm')    set layoutSm(val)   { this._cacheInput('layoutSm', val); };
  @Input('fxLayout.md')    set layoutMd(val)   { this._cacheInput('layoutMd', val); };
  @Input('fxLayout.lg')    set layoutLg(val)   { this._cacheInput('layoutLg', val); };
  @Input('fxLayout.xl')    set layoutXl(val)   { this._cacheInput('layoutXl', val); };

  @Input('fxLayout.gt-xs') set layoutGtXs(val) { this._cacheInput('layoutGtXs', val); };
  @Input('fxLayout.gt-sm') set layoutGtSm(val) { this._cacheInput('layoutGtSm', val); };
  @Input('fxLayout.gt-md') set layoutGtMd(val) { this._cacheInput('layoutGtMd', val); };
  @Input('fxLayout.gt-lg') set layoutGtLg(val) { this._cacheInput('layoutGtLg', val); };

  @Input('fxLayout.lt-sm') set layoutLtSm(val) { this._cacheInput('layoutLtSm', val); };
  @Input('fxLayout.lt-md') set layoutLtMd(val) { this._cacheInput('layoutLtMd', val); };
  @Input('fxLayout.lt-lg') set layoutLtLg(val) { this._cacheInput('layoutLtLg', val); };
  @Input('fxLayout.lt-xl') set layoutLtXl(val) { this._cacheInput('layoutLtXl', val); };

  /* tslint:enable */
  /**
   *
   */
  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              styleUtils: StyleUtils) {
    super(monitor, elRef, styleUtils);
    this._announcer = new ReplaySubject<Layout>(1);
    this.layout$ = this._announcer.asObservable();
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * On changes to any @Input properties...
   * Default to use the non-responsive Input value ('fxLayout')
   * Then conditionally override with the mq-activated Input's current value
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['layout'] != null || this._mqActivation) {
      this._updateWithDirection();
    }
  }

  /**
   * After the initial onChanges, build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  ngOnInit() {
    super.ngOnInit();

    this._listenForMediaQueryChanges('layout', 'row', (changes: MediaChange) => {
      this._updateWithDirection(changes.value);
    });
    this._updateWithDirection();
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /**
   * Validate the direction value and then update the host's inline flexbox styles
   */
  protected _updateWithDirection(value?: string) {
    value = value || this._queryInput('layout') || 'row';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }

    // Update styles and announce to subscribers the *new* direction
    let css = buildLayoutCSS(!!value ? value : '');

    this._applyStyleToElement(css);
    this._announcer.next({
      direction: css['flex-direction'],
      wrap: !!css['flex-wrap'] && css['flex-wrap'] !== 'nowrap'
    });
  }

}
