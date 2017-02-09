/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnDestroy, OnInit, Renderer, OnChanges, SimpleChanges, IterableDiffers, KeyValueDiffers } from '@angular/core';
import { NgClass } from '@angular/common';
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
    private monitor;
    private _bpRegistry;
    classXs: NgClassType;
    classGtXs: NgClassType;
    classSm: NgClassType;
    classGtSm: NgClassType;
    classMd: NgClassType;
    classGtMd: NgClassType;
    classLg: NgClassType;
    classGtLg: NgClassType;
    classXl: NgClassType;
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
    private _updateStyle(value?);
    /**
     * Special adapter to cross-cut responsive behaviors
     * into the ClassDirective
     */
    private _base;
}
