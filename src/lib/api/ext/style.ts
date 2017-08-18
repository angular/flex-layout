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
  KeyValueDiffers,
  OnDestroy,
  OnChanges,
  Optional,
  Renderer,
  Renderer2,
  SecurityContext,
  Self,
  SimpleChanges,
} from '@angular/core';
import {NgStyle} from '@angular/common';

import {BaseFxDirective} from '../core/base';
import {BaseFxDirectiveAdapter} from '../core/base-adapter';
import {MediaChange} from '../../media-query/media-change';
import {MediaMonitor} from '../../media-query/media-monitor';
import {extendObject} from '../../utils/object-extend';
import {DomSanitizer} from '@angular/platform-browser';

import {
  NgStyleRawList,
  NgStyleType,
  NgStyleSanitizer,
  ngStyleUtils as _
} from '../../utils/style-transforms';

/**
 * Directive to add responsive support for ngStyle.
 *
 */
@Directive({
  selector: `
    [style.xs], [style.sm], [style.md], [style.lg], [style.xl],
    [style.lt-sm], [style.lt-md], [style.lt-lg], [style.lt-xl],
    [style.gt-xs], [style.gt-sm], [style.gt-md], [style.gt-lg],
    [ngStyle],
    [ngStyle.xs], [ngStyle.sm], [ngStyle.lg], [ngStyle.xl],
    [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
    [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
  `
})
export class StyleDirective extends BaseFxDirective
    implements DoCheck, OnChanges, OnDestroy {

  /**
   * Intercept ngStyle assignments so we cache the default styles
   * which are merged with activated styles or used as fallbacks.
   */
  @Input('ngStyle')
  set styleBase(val: NgStyleType) {
    this._base.cacheInput('style', val, true);
    this._ngStyleInstance.ngStyle = this._base.inputMap['style'];
  }

  /* tslint:disable */
  @Input('ngStyle.xs')    set ngStyleXs(val: NgStyleType) { this._base.cacheInput('styleXs', val, true); }
  @Input('ngStyle.sm')    set ngStyleSm(val: NgStyleType) {  this._base.cacheInput('styleSm', val, true); };
  @Input('ngStyle.md')    set ngStyleMd(val: NgStyleType) { this._base.cacheInput('styleMd', val, true); };
  @Input('ngStyle.lg')    set ngStyleLg(val: NgStyleType) { this._base.cacheInput('styleLg', val, true);};
  @Input('ngStyle.xl')    set ngStyleXl(val: NgStyleType) { this._base.cacheInput('styleXl', val, true); };

  @Input('ngStyle.lt-sm') set ngStyleLtSm(val: NgStyleType) { this._base.cacheInput('styleLtSm', val, true); };
  @Input('ngStyle.lt-md') set ngStyleLtMd(val: NgStyleType) { this._base.cacheInput('styleLtMd', val, true); };
  @Input('ngStyle.lt-lg') set ngStyleLtLg(val: NgStyleType) { this._base.cacheInput('styleLtLg', val, true); };
  @Input('ngStyle.lt-xl') set ngStyleLtXl(val: NgStyleType) { this._base.cacheInput('styleLtXl', val, true); };

  @Input('ngStyle.gt-xs') set ngStyleGtXs(val: NgStyleType) { this._base.cacheInput('styleGtXs', val, true); };
  @Input('ngStyle.gt-sm') set ngStyleGtSm(val: NgStyleType) { this._base.cacheInput('styleGtSm', val, true);} ;
  @Input('ngStyle.gt-md') set ngStyleGtMd(val: NgStyleType) { this._base.cacheInput('styleGtMd', val, true);};
  @Input('ngStyle.gt-lg') set ngStyleGtLg(val: NgStyleType) { this._base.cacheInput('styleGtLg', val, true); };

  /** Deprecated selectors */
  @Input('style.xs')      set styleXs(val: NgStyleType) { this._base.cacheInput('styleXs', val, true); }
  @Input('style.sm')      set styleSm(val: NgStyleType) { this._base.cacheInput('styleSm', val, true); };
  @Input('style.md')      set styleMd(val: NgStyleType) { this._base.cacheInput('styleMd', val, true);};
  @Input('style.lg')      set styleLg(val: NgStyleType) { this._base.cacheInput('styleLg', val, true); };
  @Input('style.xl')      set styleXl(val: NgStyleType) { this._base.cacheInput('styleXl', val, true); };

  @Input('style.lt-sm')   set styleLtSm(val: NgStyleType) { this._base.cacheInput('styleLtSm', val, true); };
  @Input('style.lt-md')   set styleLtMd(val: NgStyleType) { this._base.cacheInput('styleLtMd', val, true); };
  @Input('style.lt-lg')   set styleLtLg(val: NgStyleType) { this._base.cacheInput('styleLtLg', val, true);};
  @Input('style.lt-xl')   set styleLtXl(val: NgStyleType) { this._base.cacheInput('styleLtXl', val, true); };

  @Input('style.gt-xs')   set styleGtXs(val: NgStyleType) { this._base.cacheInput('styleGtXs', val, true); };
  @Input('style.gt-sm')   set styleGtSm(val: NgStyleType) { this._base.cacheInput('styleGtSm', val, true); };
  @Input('style.gt-md')   set styleGtMd(val: NgStyleType) { this._base.cacheInput('styleGtMd', val, true);};
  @Input('style.gt-lg')   set styleGtLg(val: NgStyleType) { this._base.cacheInput('styleGtLg', val, true); };

  /* tslint:enable */
  /**
   *  Constructor for the ngStyle subclass; which adds selectors and
   *  a MediaQuery Activation Adapter
   */
  constructor(private monitor: MediaMonitor,
              protected _sanitizer: DomSanitizer,
              _ngEl: ElementRef, _renderer: Renderer2,
              _differs: KeyValueDiffers, _oldRenderer: Renderer,
              @Optional() @Self() private _ngStyleInstance: NgStyle) {

    super(monitor, _ngEl, _renderer);

    // Build adapter, `cacheInput()` interceptor, and get current inline style if any
    this._buildAdapter(this.monitor, _ngEl, _renderer);
    this._base.cacheInput('style', _ngEl.nativeElement.getAttribute('style'), true);

    // Create an instance NgStyle Directive instance only if `ngStyle=""` has NOT been defined on
    // the same host element; since the responsive versions may be defined...
    if ( !this._ngStyleInstance ) {
      this._ngStyleInstance = new NgStyle(_differs, _ngEl, _oldRenderer);
    }
  }

  // ******************************************************************
  // Lifecycle Hooks
  // ******************************************************************

  /**
   * For @Input changes on the current mq activation property
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this._base.activeKey in changes) {
      this._updateStyle();
    }
  }

  /**
   * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
   */
  ngDoCheck() {
    if (!this._base.hasMediaQueryListener) {
      this._configureMQListener();
    }
    this._ngStyleInstance.ngDoCheck();
  }

  ngOnDestroy() {
    this._base.ngOnDestroy();
    this._ngStyleInstance = null;
  }

  // ******************************************************************
  // Internal Methods
  // ******************************************************************

  /**
     * Build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    protected _configureMQListener() {
      this._base.listenForMediaQueryChanges('style', '', (changes: MediaChange) => {
        this._updateStyle(changes.value);

        // trigger NgClass::_applyIterableChanges()
        this._ngStyleInstance.ngDoCheck();
      });
    }

  // ************************************************************************
  // Private Internal Methods
  // ************************************************************************

  /**
   * Use the currently activated input property and assign to
   * `ngStyle` which does the style injections...
   */
  protected _updateStyle(value?: NgStyleType) {
    let style = value || this._base.queryInput('style') || '';
    if (this._base.mqActivation) {
      style = this._base.mqActivation.activatedInput;
    }

    // Delegate subsequent activity to the NgStyle logic
    this._ngStyleInstance.ngStyle = style;
  }


  /**
   * Build MediaQuery Activation Adapter
   * This adapter manages listening to mediaQuery change events and identifying
   * which property value should be used for the style update
   */
  protected _buildAdapter(monitor: MediaMonitor, _ngEl: ElementRef, _renderer: Renderer2) {
    this._base = new BaseFxDirectiveAdapter('style', monitor, _ngEl, _renderer);
    this._buildCacheInterceptor();
  }

  /**
   * Build intercept to convert raw strings to ngStyleMap
   */
  protected _buildCacheInterceptor() {
    let cacheInput = this._base.cacheInput.bind(this._base);
    this._base.cacheInput = (key?: string, source?: any, cacheRaw = false, merge = true) => {
      let styles = this._buildStyleMap(source);
      if (merge) {
        styles = extendObject({}, this._base.inputMap['style'], styles);
      }
      cacheInput(key, styles, cacheRaw);
    };
  }
  /**
   * Convert raw strings to ngStyleMap; which is required by ngStyle
   * NOTE: Raw string key-value pairs MUST be delimited by `;`
   *       Comma-delimiters are not supported due to complexities of
   *       possible style values such as `rgba(x,x,x,x)` and others
   */
  protected _buildStyleMap(styles: NgStyleType) {
    let sanitizer: NgStyleSanitizer = (val: any) => {
      // Always safe-guard (aka sanitize) style property values
      return this._sanitizer.sanitize(SecurityContext.STYLE, val);
    };
    if (styles) {
      switch ( _.getType(styles) ) {
        case 'string':  return _.buildMapFromList(_.buildRawList(styles), sanitizer);
        case 'array' :  return _.buildMapFromList(styles as NgStyleRawList, sanitizer);
        case 'set'   :  return _.buildMapFromSet(styles, sanitizer);
        default      :  return _.buildMapFromSet(styles, sanitizer);
      }
    }
    return styles;
  }

  /**
   * Special adapter to cross-cut responsive behaviors
   * into the StyleDirective
   */
  protected _base: BaseFxDirectiveAdapter;

}
