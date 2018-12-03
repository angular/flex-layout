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
  Injectable,
} from '@angular/core';
import {
  BaseDirective,
  MediaChange,
  MediaMonitor,
  StyleBuilder,
  StyleDefinition,
  StyleUtils,
} from '@angular/flex-layout/core';
import {Observable, ReplaySubject} from 'rxjs';

import {buildLayoutCSS} from '../../utils/layout-validator';

export type Layout = {
  direction: LayoutValuesType;
  wrap: boolean;
};

export interface LayoutParent {
  announcer: ReplaySubject<Layout>;
}

type LayoutValuesType
  = ''
  | 'row'
  | 'row-reverse'
  | 'column'
  | 'column-reverse'
  ;

@Injectable({providedIn: 'root'})
export class LayoutStyleBuilder extends StyleBuilder {
  buildStyles(input: string, _parent: LayoutParent) {
    const styles = buildLayoutCSS(input);
    return styles;
  }
  sideEffect(_input: string, styles: StyleDefinition, parent: LayoutParent) {
    parent.announcer.next({
      direction: styles['flex-direction'] as LayoutValuesType,
      wrap: !!styles['flex-wrap'] && styles['flex-wrap'] !== 'nowrap'
    });
  }
}

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
export class LayoutDirective extends BaseDirective implements OnInit, OnChanges, OnDestroy {

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
  @Input('fxLayout')       set layout(val: LayoutValuesType)     { this._cacheInput('layout', val); };
  @Input('fxLayout.xs')    set layoutXs(val: LayoutValuesType)   { this._cacheInput('layoutXs', val); };
  @Input('fxLayout.sm')    set layoutSm(val: LayoutValuesType)   { this._cacheInput('layoutSm', val); };
  @Input('fxLayout.md')    set layoutMd(val: LayoutValuesType)   { this._cacheInput('layoutMd', val); };
  @Input('fxLayout.lg')    set layoutLg(val: LayoutValuesType)   { this._cacheInput('layoutLg', val); };
  @Input('fxLayout.xl')    set layoutXl(val: LayoutValuesType)   { this._cacheInput('layoutXl', val); };

  @Input('fxLayout.gt-xs') set layoutGtXs(val: LayoutValuesType) { this._cacheInput('layoutGtXs', val); };
  @Input('fxLayout.gt-sm') set layoutGtSm(val: LayoutValuesType) { this._cacheInput('layoutGtSm', val); };
  @Input('fxLayout.gt-md') set layoutGtMd(val: LayoutValuesType) { this._cacheInput('layoutGtMd', val); };
  @Input('fxLayout.gt-lg') set layoutGtLg(val: LayoutValuesType) { this._cacheInput('layoutGtLg', val); };

  @Input('fxLayout.lt-sm') set layoutLtSm(val: LayoutValuesType) { this._cacheInput('layoutLtSm', val); };
  @Input('fxLayout.lt-md') set layoutLtMd(val: LayoutValuesType) { this._cacheInput('layoutLtMd', val); };
  @Input('fxLayout.lt-lg') set layoutLtLg(val: LayoutValuesType) { this._cacheInput('layoutLtLg', val); };
  @Input('fxLayout.lt-xl') set layoutLtXl(val: LayoutValuesType) { this._cacheInput('layoutLtXl', val); };
  /* tslint:enable */

  constructor(monitor: MediaMonitor,
              elRef: ElementRef,
              styleUtils: StyleUtils,
              styleBuilder: LayoutStyleBuilder) {
    super(monitor, elRef, styleUtils, styleBuilder);
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
  }

  // *********************************************
  // Protected methods
  // *********************************************

  /** Validate the direction value and then update the host's inline flexbox styles */
  protected _updateWithDirection(value?: string) {
    value = value || this._queryInput('layout') || 'row';
    if (this._mqActivation) {
      value = this._mqActivation.activatedInput;
    }
    this.addStyles(value || '', {announcer: this._announcer});
  }

  protected _styleCache = layoutCache;
}

const layoutCache: Map<string, StyleDefinition> = new Map();
