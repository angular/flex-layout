/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, DoCheck, OnDestroy, Renderer, Renderer2, IterableDiffers, KeyValueDiffers, SimpleChanges, OnChanges } from '@angular/core';
import { NgClass } from '@angular/common';
import { BaseFxDirectiveAdapter } from './base-adapter';
import { MediaMonitor } from '../../media-query/media-monitor';
/** NgClass allowed inputs **/
export declare type NgClassType = string | string[] | Set<string> | {
    [klass: string]: any;
};
/**
 * Directive to add responsive support for ngClass.
 */
export declare class ClassDirective extends NgClass implements DoCheck, OnChanges, OnDestroy {
    protected monitor: MediaMonitor;
    /**
     * Intercept ngClass assignments so we cache the default classes
     * which are merged with activated styles or used as fallbacks.
     * Note: Base ngClass values are applied during ngDoCheck()
     */
    ngClassBase: NgClassType;
    ngClassXs: NgClassType;
    ngClassSm: NgClassType;
    ngClassMd: NgClassType;
    ngClassLg: NgClassType;
    ngClassXl: NgClassType;
    ngClassLtSm: NgClassType;
    ngClassLtMd: NgClassType;
    ngClassLtLg: NgClassType;
    ngClassLtXl: NgClassType;
    ngClassGtXs: NgClassType;
    ngClassGtSm: NgClassType;
    ngClassGtMd: NgClassType;
    ngClassGtLg: NgClassType;
    /** Deprecated selectors */
    /**
     * Base class selector values get applied immediately and are considered destructive overwrites to
     * all previous class assignments
     *
     * Delegate to NgClass:klass setter and cache value for base fallback from responsive APIs.
     */
    classBase: string;
    classXs: NgClassType;
    classSm: NgClassType;
    classMd: NgClassType;
    classLg: NgClassType;
    classXl: NgClassType;
    classLtSm: NgClassType;
    classLtMd: NgClassType;
    classLtLg: NgClassType;
    classLtXl: NgClassType;
    classGtXs: NgClassType;
    classGtSm: NgClassType;
    classGtMd: NgClassType;
    classGtLg: NgClassType;
    /**
     * Initial value of the `class` attribute; used as
     * fallback and will be merged with nay `ngClass` values
     */
    readonly initialClasses: string;
    constructor(monitor: MediaMonitor, _iterableDiffers: IterableDiffers, _keyValueDiffers: KeyValueDiffers, _ngEl: ElementRef, _oldRenderer: Renderer, _renderer: Renderer2);
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
     *  Apply updates directly to the NgClass:klass property
     *  ::ngDoCheck() is not needed
     */
    protected _updateKlass(value?: NgClassType): void;
    /**
     *  Identify the activated input value and update the ngClass iterables...
     *  needs ngDoCheck() to actually apply the values to the element
     */
    protected _updateNgClass(value?: NgClassType): void;
    /**
     * Special adapter to cross-cut responsive behaviors
     * into the ClassDirective
     */
    protected _classAdapter: BaseFxDirectiveAdapter;
    protected _ngClassAdapter: BaseFxDirectiveAdapter;
}
