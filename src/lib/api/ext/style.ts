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
  KeyValueDiffers,
  OnDestroy,
  OnChanges,
  Optional,
  Renderer2,
  SecurityContext,
  Self,
  SimpleChanges, OnInit,
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
import {RendererAdapter} from '../core/renderer-adapter';


/**
 * Directive to add responsive support for ngStyle.
 *
 */
@Directive({
  selector: `
    [ngStyle.xs], [ngStyle.sm], [ngStyle.md], [ngStyle.lg], [ngStyle.xl],
    [ngStyle.lt-sm], [ngStyle.lt-md], [ngStyle.lt-lg], [ngStyle.lt-xl],
    [ngStyle.gt-xs], [ngStyle.gt-sm], [ngStyle.gt-md], [ngStyle.gt-lg]
  `
})
export class StyleDirective extends BaseFxDirective
    implements DoCheck, OnChanges, OnDestroy, OnInit {

  /**
   * Intercept ngStyle assignments so we cache the default styles
   * which are merged with activated styles or used as fallbacks.
   */
  @Input('ngStyle')
  set ngStyleBase(val: NgStyleType) {
    const key = 'ngStyle';
    this._base.cacheInput(key, val, true);  // convert val to hashmap
    this._ngStyleInstance.ngStyle = this._base.queryInput(key);
  }

  /* tslint:disable */
  @Input('ngStyle.xs')    set ngStyleXs(val: NgStyleType) { this._base.cacheInput('ngStyleXs', val, true); }
  @Input('ngStyle.sm')    set ngStyleSm(val: NgStyleType) { this._base.cacheInput('ngStyleSm', val, true); };
  @Input('ngStyle.md')    set ngStyleMd(val: NgStyleType) { this._base.cacheInput('ngStyleMd', val, true); };
  @Input('ngStyle.lg')    set ngStyleLg(val: NgStyleType) { this._base.cacheInput('ngStyleLg', val, true); };
  @Input('ngStyle.xl')    set ngStyleXl(val: NgStyleType) { this._base.cacheInput('ngStyleXl', val, true); };

  @Input('ngStyle.lt-sm') set ngStyleLtSm(val: NgStyleType) { this._base.cacheInput('ngStyleLtSm', val, true); };
  @Input('ngStyle.lt-md') set ngStyleLtMd(val: NgStyleType) { this._base.cacheInput('ngStyleLtMd', val, true); };
  @Input('ngStyle.lt-lg') set ngStyleLtLg(val: NgStyleType) { this._base.cacheInput('ngStyleLtLg', val, true); };
  @Input('ngStyle.lt-xl') set ngStyleLtXl(val: NgStyleType) { this._base.cacheInput('ngStyleLtXl', val, true); };

  @Input('ngStyle.gt-xs') set ngStyleGtXs(val: NgStyleType) { this._base.cacheInput('ngStyleGtXs', val, true); };
  @Input('ngStyle.gt-sm') set ngStyleGtSm(val: NgStyleType) { this._base.cacheInput('ngStyleGtSm', val, true); } ;
  @Input('ngStyle.gt-md') set ngStyleGtMd(val: NgStyleType) { this._base.cacheInput('ngStyleGtMd', val, true); };
  @Input('ngStyle.gt-lg') set ngStyleGtLg(val: NgStyleType) { this._base.cacheInput('ngStyleGtLg', val, true); };
  /* tslint:enable */

  /**
   *  Constructor for the ngStyle subclass; which adds selectors and
   *  a MediaQuery Activation Adapter
   */
  constructor(private monitor: MediaMonitor,
              protected _sanitizer: DomSanitizer,
              protected _ngEl: ElementRef,
              protected _renderer: Renderer2,
              protected _differs: KeyValueDiffers,
              @Optional() @Self() private _ngStyleInstance: NgStyle) {

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
      this._ngStyleInstance.ngStyle = this._base.mqActivation.activatedInput || '';
    }
  }


  ngOnInit() {
    this._configureMQListener();
  }
  /**
   * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
   */
  ngDoCheck() {
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
     * Configure adapters (that delegate to an internal ngClass instance) if responsive
     * keys have been defined.
     */
    protected _configureAdapters() {
        this._base = new BaseFxDirectiveAdapter(
            'ngStyle', this.monitor, this._ngEl, this._renderer
        );
        if ( !this._ngStyleInstance ) {
          // Create an instance NgClass Directive instance only if `ngClass=""` has NOT been
          // defined on the same host element; since the responsive variations may be defined...
          let adapter = new RendererAdapter(this._renderer);
          this._ngStyleInstance = new NgStyle(this._differs, this._ngEl, <any> adapter);
        }

        this._buildCacheInterceptor();
        this._fallbackToStyle();
    }

    /**
     * Build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    protected _configureMQListener(baseKey = 'ngStyle') {
      const fallbackValue = this._base.queryInput(baseKey);
      this._base.listenForMediaQueryChanges(baseKey, fallbackValue, (changes: MediaChange) => {
        this._ngStyleInstance.ngStyle = changes.value || '';
        this._ngStyleInstance.ngDoCheck();
      });
    }

  // ************************************************************************
  // Private Internal Methods
  // ************************************************************************

  /**
   * Build intercept to convert raw strings to ngStyleMap
   */
  protected _buildCacheInterceptor() {
    let cacheInput = this._base.cacheInput.bind(this._base);
    this._base.cacheInput = (key?: string, source?: any, cacheRaw = false, merge = true) => {
      let styles = this._buildStyleMap(source);
      if (merge) {
        styles = extendObject({}, this._base.inputMap['ngStyle'], styles);
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
   * Initial lookup of raw 'class' value (if any)
   */
  protected _fallbackToStyle() {
    if (!this._base.queryInput('ngStyle')) {
      this.ngStyleBase = this._getAttributeValue('style') || '';
    }
  }

  /**
   * Special adapter to cross-cut responsive behaviors
   * into the StyleDirective
   */
  protected _base: BaseFxDirectiveAdapter;

}
