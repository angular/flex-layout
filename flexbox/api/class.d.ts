/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy, OnInit, Renderer, OnChanges, SimpleChanges, IterableDiffers, KeyValueDiffers } from '@angular/core';
import { NgClass } from '@angular/common';
import { BaseFxDirectiveAdapter } from './base-adapter';
import { BreakPointRegistry } from './../../media-query/breakpoints/break-point-registry';
import { MediaMonitor } from '../../media-query/media-monitor';
/** NgClass allowed inputs **/
export declare type NgClassType = string | string[] | Set<string> | {
    [klass: string]: any;
};
/**
 * Directive to add responsive support for ngClass.
 */
export declare class ClassDirective extends NgClass implements OnInit, OnChanges, OnDestroy {
    protected monitor: MediaMonitor;
    protected _bpRegistry: BreakPointRegistry;
    /**
     * Intercept ngClass assignments so we cache the default classes
     * which are merged with activated styles or used as fallbacks.
     */
    ngClassBase: NgClassType;
    ngClassXs: NgClassType;
    ngClassSm: NgClassType;
    ngClassMd: NgClassType;
    ngClassLg: NgClassType;
    ngClassXl: NgClassType;
    ngClassLtXs: NgClassType;
    ngClassLtSm: NgClassType;
    ngClassLtMd: NgClassType;
    ngClassLtLg: NgClassType;
    ngClassGtXs: NgClassType;
    ngClassGtSm: NgClassType;
    ngClassGtMd: NgClassType;
    ngClassGtLg: NgClassType;
    /** Deprecated selectors */
    classBase: NgClassType;
    classXs: NgClassType;
    classSm: NgClassType;
    classMd: NgClassType;
    classLg: NgClassType;
    classXl: NgClassType;
    classLtXs: NgClassType;
    classLtSm: NgClassType;
    classLtMd: NgClassType;
    classLtLg: NgClassType;
    classGtXs: NgClassType;
    classGtSm: NgClassType;
    classGtMd: NgClassType;
    classGtLg: NgClassType;
    constructor(monitor: MediaMonitor, _bpRegistry: BreakPointRegistry, _iterableDiffers: IterableDiffers, _keyValueDiffers: KeyValueDiffers, _ngEl: ElementRef, _renderer: Renderer);
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
    protected _updateClass(value?: NgClassType): void;
    /**
     * Special adapter to cross-cut responsive behaviors
     * into the ClassDirective
     */
    protected _base: BaseFxDirectiveAdapter;
}
