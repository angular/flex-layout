/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
  Renderer,
  Renderer2,
  SimpleChanges,
  Self
} from '@angular/core';
import {NgClass} from '@angular/common';

import {BaseFxDirective} from '../core/base';
import {BaseFxDirectiveAdapter} from '../core/base-adapter';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';

/** NgClass allowed inputs **/
export type NgClassType = string | string[] | Set<string> | {[klass: string]: any};

/**
 * Directive to add responsive support for ngClass.
 */
@Directive({
  selector: `
    [class.xs], [class.sm], [class.md], [class.lg], [class.xl],
    [class.lt-sm], [class.lt-md], [class.lt-lg], [class.lt-xl],
    [class.gt-xs], [class.gt-sm], [class.gt-md], [class.gt-lg],

    [ngClass], [ngClass.xs], [ngClass.sm], [ngClass.md], [ngClass.lg], [ngClass.xl],
    [ngClass.lt-sm], [ngClass.lt-md], [ngClass.lt-lg], [ngClass.lt-xl],
    [ngClass.gt-xs], [ngClass.gt-sm], [ngClass.gt-md], [ngClass.gt-lg]
  `
})
export class ClassDirective extends BaseFxDirective
    implements DoCheck, OnChanges, OnDestroy {

  /**
   * Intercept ngClass assignments so we cache the default classes
   * which are merged with activated styles or used as fallbacks.
   * Note: Base ngClass values are applied during ngDoCheck()
   */
  @Input('ngClass')
  set ngClassBase(val: NgClassType) {
    this._ngClassAdapter.cacheInput('ngClass', val, true);
    this._ngClassInstance.ngClass = val;
  }

  /* tslint:disable */
  @Input('ngClass.xs')    set ngClassXs(val:   NgClassType) { this._ngClassAdapter.cacheInput('ngClassXs',   val, true); }
  @Input('ngClass.sm')    set ngClassSm(val:   NgClassType) { this._ngClassAdapter.cacheInput('ngClassSm',   val, true); }
  @Input('ngClass.md')    set ngClassMd(val:   NgClassType) { this._ngClassAdapter.cacheInput('ngClassMd',   val, true); }
  @Input('ngClass.lg')    set ngClassLg(val:   NgClassType) { this._ngClassAdapter.cacheInput('ngClassLg',   val, true); }
  @Input('ngClass.xl')    set ngClassXl(val:   NgClassType) { this._ngClassAdapter.cacheInput('ngClassXl',   val, true); }

  @Input('ngClass.lt-sm') set ngClassLtSm(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassLtSm', val, true); }
  @Input('ngClass.lt-md') set ngClassLtMd(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassLtMd', val, true); }
  @Input('ngClass.lt-lg') set ngClassLtLg(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassLtLg', val, true); }
  @Input('ngClass.lt-xl') set ngClassLtXl(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassLtXl', val, true); }

  @Input('ngClass.gt-xs') set ngClassGtXs(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassGtXs', val, true); }
  @Input('ngClass.gt-sm') set ngClassGtSm(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassGtSm', val, true); }
  @Input('ngClass.gt-md') set ngClassGtMd(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassGtMd', val, true); }
  @Input('ngClass.gt-lg') set ngClassGtLg(val: NgClassType) { this._ngClassAdapter.cacheInput('ngClassGtLg', val, true); }

  /** Deprecated selectors */

  @Input('class.xs')      set classXs(val:   NgClassType) { this._classAdapter.cacheInput('classXs',   val); }
  @Input('class.sm')      set classSm(val:   NgClassType) { this._classAdapter.cacheInput('classSm',   val); }
  @Input('class.md')      set classMd(val:   NgClassType) { this._classAdapter.cacheInput('classMd',   val); }
  @Input('class.lg')      set classLg(val:   NgClassType) { this._classAdapter.cacheInput('classLg',   val); }
  @Input('class.xl')      set classXl(val:   NgClassType) { this._classAdapter.cacheInput('classXl',   val); }

  @Input('class.lt-sm')   set classLtSm(val: NgClassType) { this._classAdapter.cacheInput('classLtSm', val); }
  @Input('class.lt-md')   set classLtMd(val: NgClassType) { this._classAdapter.cacheInput('classLtMd', val); }
  @Input('class.lt-lg')   set classLtLg(val: NgClassType) { this._classAdapter.cacheInput('classLtLg', val); }
  @Input('class.lt-xl')   set classLtXl(val: NgClassType) { this._classAdapter.cacheInput('classLtXl', val); }

  @Input('class.gt-xs')   set classGtXs(val: NgClassType) { this._classAdapter.cacheInput('classGtXs', val); }
  @Input('class.gt-sm')   set classGtSm(val: NgClassType) { this._classAdapter.cacheInput('classGtSm', val); }
  @Input('class.gt-md')   set classGtMd(val: NgClassType) { this._classAdapter.cacheInput('classGtMd', val); }
  @Input('class.gt-lg')   set classGtLg(val: NgClassType) { this._classAdapter.cacheInput('classGtLg', val); }

  /* tslint:enable */
  constructor(protected monitor: MediaMonitor,
              _ngEl: ElementRef, _renderer: Renderer2, _oldRenderer: Renderer,
              _iterableDiffers: IterableDiffers, _keyValueDiffers: KeyValueDiffers,
              @Optional() @Self() private _ngClassInstance: NgClass) {

    super(monitor, _ngEl, _renderer);

    this._ngClassAdapter = new BaseFxDirectiveAdapter('ngClass', monitor, _ngEl, _renderer);
    this._classAdapter = new BaseFxDirectiveAdapter('class', monitor, _ngEl, _renderer);
    this._classAdapter.cacheInput('class', _ngEl.nativeElement.getAttribute('class') || '');

    // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been defined on
    // the same host element; since the responsive variations may be defined...
    if ( !this._ngClassInstance ) {
      this._ngClassInstance = new NgClass(_iterableDiffers, _keyValueDiffers, _ngEl, _oldRenderer);
    }
  }

  // ******************************************************************
  // Lifecycle Hooks
  // ******************************************************************

  /**
   * For @Input changes on the current mq activation property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.hasInitialized) {
      if (this._classAdapter.activeKey in changes) {
        this._updateKlass();
      }
      if (this._ngClassAdapter.activeKey in changes) {
        this._updateNgClass();
      }
    }
  }

  /**
   * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
   */
  ngDoCheck() {
    if (!this._classAdapter.hasMediaQueryListener) {
      this._configureMQListener();
    }
    if ( this._ngClassInstance) {
      this._ngClassInstance.ngDoCheck();
    }
  }

  ngOnDestroy() {
    this._classAdapter.ngOnDestroy();
    this._ngClassAdapter.ngOnDestroy();
    this._ngClassInstance = null;
  }

  // ******************************************************************
  // Internal Methods
  // ******************************************************************

  /**
   * Build an mqActivation object that bridges
   * mql change events to onMediaQueryChange handlers
   */
  protected _configureMQListener() {
    const value = this._classAdapter.queryInput('class');
    this._classAdapter.listenForMediaQueryChanges('class', value, (changes: MediaChange) => {
      this._updateKlass(changes.value);
    });

    this._ngClassAdapter.listenForMediaQueryChanges('ngClass', value, (changes: MediaChange) => {
      this._updateNgClass(changes.value);
      this._ngClassInstance.ngDoCheck();    // trigger NgClass::_applyIterableChanges()
    });
  }

  /**
   *  Apply updates directly to the NgClass:klass property
   *  ::ngDoCheck() is not needed
   */
  protected _updateKlass(value?: NgClassType) {
    let klass = value || this._classAdapter.queryInput('class');
    if (this._classAdapter.mqActivation) {
      klass = this._classAdapter.mqActivation.activatedInput;
    }
    this._ngClassInstance.klass = klass;
  }

  /**
   *  Identify the activated input value and update the ngClass iterables...
   *  needs ngDoCheck() to actually apply the values to the element
   */
  protected _updateNgClass(value?: NgClassType) {
    if (this._ngClassAdapter.mqActivation) {
      value = this._ngClassAdapter.mqActivation.activatedInput;
    }

    // Delegate subsequent activity to the NgClass logic
    this._ngClassInstance.ngClass = value || '';
  }

  /**
   * Special adapter to cross-cut responsive behaviors
   * into the ClassDirective instance
   */
  protected _classAdapter: BaseFxDirectiveAdapter;   // used for `class.xxx` selectors
  protected _ngClassAdapter: BaseFxDirectiveAdapter;   // used for `ngClass.xxx` selectors
}

