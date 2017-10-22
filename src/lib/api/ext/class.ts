/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  IterableDiffers,
  KeyValueDiffers,
  OnChanges,
  OnDestroy,
  Optional,
  Renderer2,
  SimpleChanges,
  Self, OnInit
} from '@angular/core';
import {NgClass} from '@angular/common';

import {BaseFxDirective} from '../core/base';
import {BaseFxDirectiveAdapter} from '../core/base-adapter';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {RendererAdapter} from '../core/renderer-adapter';

/** NgClass allowed inputs **/
export type NgClassType = string | string[] | Set<string> | {[klass: string]: any};

/**
 * Directive to add responsive support for ngClass.
 * This maintains the core functionality of 'ngClass' and adds responsive API
 *
 */
@Directive({
  selector: `
    [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
    [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
    [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
  `
})
export class ClassDirective extends BaseFxDirective
    implements DoCheck, OnChanges, OnDestroy, OnInit {

  /**
   * Intercept ngClass assignments so we cache the default classes
   * which are merged with activated styles or used as fallbacks.
   * Note: Base ngClass values are applied during ngDoCheck()
   */
  @Input('ngClass')
  set ngClassBase(val: NgClassType) {
    const key = 'ngClass';
    this._base.cacheInput(key, val, true);
    this._ngClassInstance.ngClass = this._base.queryInput(key);
  }

  /**
   * Capture class assignments so we cache the default classes
   * which are merged with activated styles and used as fallbacks.
   */
  @Input('class')
  set klazz(val: string) {
    const key = 'class';
    this._base.cacheInput(key, val);
    this._ngClassInstance.klass = val;
  }

  /* tslint:disable */
  @Input('ngClass.xs')    set ngClassXs(val:   NgClassType) { this._base.cacheInput('ngClassXs',   val, true); }
  @Input('ngClass.sm')    set ngClassSm(val:   NgClassType) { this._base.cacheInput('ngClassSm',   val, true); }
  @Input('ngClass.md')    set ngClassMd(val:   NgClassType) { this._base.cacheInput('ngClassMd',   val, true); }
  @Input('ngClass.lg')    set ngClassLg(val:   NgClassType) { this._base.cacheInput('ngClassLg',   val, true); }
  @Input('ngClass.xl')    set ngClassXl(val:   NgClassType) { this._base.cacheInput('ngClassXl',   val, true); }

  @Input('ngClass.lt-sm') set ngClassLtSm(val: NgClassType) { this._base.cacheInput('ngClassLtSm', val, true); }
  @Input('ngClass.lt-md') set ngClassLtMd(val: NgClassType) { this._base.cacheInput('ngClassLtMd', val, true); }
  @Input('ngClass.lt-lg') set ngClassLtLg(val: NgClassType) { this._base.cacheInput('ngClassLtLg', val, true); }
  @Input('ngClass.lt-xl') set ngClassLtXl(val: NgClassType) { this._base.cacheInput('ngClassLtXl', val, true); }

  @Input('ngClass.gt-xs') set ngClassGtXs(val: NgClassType) { this._base.cacheInput('ngClassGtXs', val, true); }
  @Input('ngClass.gt-sm') set ngClassGtSm(val: NgClassType) { this._base.cacheInput('ngClassGtSm', val, true); }
  @Input('ngClass.gt-md') set ngClassGtMd(val: NgClassType) { this._base.cacheInput('ngClassGtMd', val, true); }
  @Input('ngClass.gt-lg') set ngClassGtLg(val: NgClassType) { this._base.cacheInput('ngClassGtLg', val, true); }

  /* tslint:enable */
  constructor(protected monitor: MediaMonitor,
              protected _iterableDiffers: IterableDiffers,
              protected _keyValueDiffers: KeyValueDiffers,
              protected _ngEl: ElementRef,
              protected _renderer: Renderer2,
              @Optional() @Self() private _ngClassInstance: NgClass ) {
    super(monitor, _ngEl, _renderer);
    this._configureAdapters();
  }

  // ******************************************************************
  // Lifecycle Hooks
  // ******************************************************************

  /**
   * For @Input changes on the current mq activation property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._base.activeKey in changes) {
      this._ngClassInstance.ngClass = this._base.mqActivation.activatedInput || '';
    }
  }

  ngOnInit() {
    this._configureMQListener();
  }

  /**
   * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
   */
  ngDoCheck() {
    this._ngClassInstance.ngDoCheck();
  }

  ngOnDestroy() {
    this._base.ngOnDestroy();
    this._ngClassInstance = null;
  }

  // ******************************************************************
  // Internal Methods
  // ******************************************************************

  /**
   * Configure adapters (that delegate to an internal ngClass instance) if responsive
   * keys have been defined.
   */
  protected _configureAdapters() {
    this._base = new BaseFxDirectiveAdapter(
        'ngClass', this.monitor, this._ngEl, this._renderer
    );
    if (!this._ngClassInstance) {
      // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been defined on
      // the same host element; since the responsive variations may be defined...
      let adapter = new RendererAdapter(this._renderer);
      this._ngClassInstance = new NgClass(
          this._iterableDiffers, this._keyValueDiffers, this._ngEl, <any> adapter
      );
    }
  }

  /**
   * Build an mqActivation object that bridges mql change events to onMediaQueryChange handlers
   * NOTE: We delegate subsequent activity to the NgClass logic
   *       Identify the activated input value and update the ngClass iterables...
   *       Use ngDoCheck() to actually apply the values to the element
   */
  protected _configureMQListener(baseKey = 'ngClass') {
    const fallbackValue = this._base.queryInput(baseKey);
    this._base.listenForMediaQueryChanges(baseKey, fallbackValue, (changes: MediaChange) => {
      this._ngClassInstance.ngClass = changes.value || '';
      this._ngClassInstance.ngDoCheck();
    });
  }

  /**
   * Special adapter to cross-cut responsive behaviors and capture mediaQuery changes
   * Delegate value changes to the internal `_ngClassInstance` for processing
   */
  protected _base: BaseFxDirectiveAdapter;   // used for `ngClass.xxx` selectors
}
