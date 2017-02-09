/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy, OnInit, Renderer, OnChanges, SimpleChanges, KeyValueDiffers } from '@angular/core';
import { NgStyle } from '@angular/common';
import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { MediaMonitor } from '../../media-query/media-monitor';
/** NgStyle allowed inputs **/
export declare type NgStyleType = string | string[] | Set<string> | {
    [klass: string]: any;
};
/**
 * Directive to add responsive support for ngStyle.
 *
 */
export declare class StyleDirective extends NgStyle implements OnInit, OnChanges, OnDestroy {
    private monitor;
    private _bpRegistry;
    styleXs: NgStyleType;
    styleGtXs: NgStyleType;
    styleSm: NgStyleType;
    styleGtSm: NgStyleType;
    styleMd: NgStyleType;
    styleGtMd: NgStyleType;
    styleLg: NgStyleType;
    styleGtLg: NgStyleType;
    styleXl: NgStyleType;
    /**
     *
     */
    constructor(monitor: MediaMonitor, _bpRegistry: BreakPointRegistry, _differs: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer);
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    private _updateStyle(value?);
    /**
     * Special adapter to cross-cut responsive behaviors
     * into the StyleDirective
     */
    private _base;
}
