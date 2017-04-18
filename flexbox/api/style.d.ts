/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy, DoCheck, Renderer, Renderer2, KeyValueDiffers, SimpleChanges, OnChanges } from '@angular/core';
import { NgStyle } from '@angular/common';
import { BaseFxDirectiveAdapter } from './base-adapter';
import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { MediaMonitor } from '../../media-query/media-monitor';
import { DomSanitizer } from '@angular/platform-browser';
import { NgStyleType } from '../../utils/style-transforms';
/**
 * Directive to add responsive support for ngStyle.
 *
 */
export declare class StyleDirective extends NgStyle implements DoCheck, OnChanges, OnDestroy {
    private monitor;
    protected _bpRegistry: BreakPointRegistry;
    protected _sanitizer: DomSanitizer;
    /**
     * Intercept ngStyle assignments so we cache the default styles
     * which are merged with activated styles or used as fallbacks.
     */
    styleBase: NgStyleType;
    ngStyleXs: NgStyleType;
    ngStyleSm: NgStyleType;
    ngStyleMd: NgStyleType;
    ngStyleLg: NgStyleType;
    ngStyleXl: NgStyleType;
    ngStyleLtSm: NgStyleType;
    ngStyleLtMd: NgStyleType;
    ngStyleLtLg: NgStyleType;
    ngStyleLtXl: NgStyleType;
    ngStyleGtXs: NgStyleType;
    ngStyleGtSm: NgStyleType;
    ngStyleGtMd: NgStyleType;
    ngStyleGtLg: NgStyleType;
    /** Deprecated selectors */
    styleXs: NgStyleType;
    styleSm: NgStyleType;
    styleMd: NgStyleType;
    styleLg: NgStyleType;
    styleXl: NgStyleType;
    styleLtSm: NgStyleType;
    styleLtMd: NgStyleType;
    styleLtLg: NgStyleType;
    styleLtXl: NgStyleType;
    styleGtXs: NgStyleType;
    styleGtSm: NgStyleType;
    styleGtMd: NgStyleType;
    styleGtLg: NgStyleType;
    /**
     *  Constructor for the ngStyle subclass; which adds selectors and
     *  a MediaQuery Activation Adapter
     */
    constructor(monitor: MediaMonitor, _bpRegistry: BreakPointRegistry, _sanitizer: DomSanitizer, _differs: KeyValueDiffers, _ngEl: ElementRef, _oldRenderer: Renderer, _renderer: Renderer2);
    /**
     * For @Input changes on the current mq activation property
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * For ChangeDetectionStrategy.onPush and ngOnChanges() updates
     */
    ngDoCheck(): void;
    ngOnDestroy(): void;
    /**
       * Build an mqActivation object that bridges
       * mql change events to onMediaQueryChange handlers
       */
    protected _configureMQListener(): void;
    /**
     * Use the currently activated input property and assign to
     * `ngStyle` which does the style injections...
     */
    protected _updateStyle(value?: NgStyleType): void;
    /**
     * Build MediaQuery Activation Adapter
     * This adapter manages listening to mediaQuery change events and identifying
     * which property value should be used for the style update
     */
    protected _buildAdapter(monitor: MediaMonitor, _ngEl: ElementRef, _renderer: Renderer2): void;
    /**
     * Build intercept to convert raw strings to ngStyleMap
     */
    protected _buildCacheInterceptor(): void;
    /**
     * Convert raw strings to ngStyleMap; which is required by ngStyle
     * NOTE: Raw string key-value pairs MUST be delimited by `;`
     *       Comma-delimiters are not supported due to complexities of
     *       possible style values such as `rgba(x,x,x,x)` and others
     */
    protected _buildStyleMap(styles: NgStyleType): NgStyleType;
    /**
     * Special adapter to cross-cut responsive behaviors
     * into the StyleDirective
     */
    protected _base: BaseFxDirectiveAdapter;
}
