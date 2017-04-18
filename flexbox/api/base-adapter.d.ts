/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2 } from '@angular/core';
import { BaseFxDirective } from './base';
import { ResponsiveActivation } from './../responsive/responsive-activation';
import { MediaQuerySubscriber } from '../../media-query/media-change';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * Adapter to the BaseFxDirective abstract class so it can be used via composition.
 * @see BaseFxDirective
 */
export declare class BaseFxDirectiveAdapter extends BaseFxDirective {
    protected _baseKey: string;
    protected _mediaMonitor: MediaMonitor;
    protected _elementRef: ElementRef;
    protected _renderer: Renderer2;
    /**
     * Accessor to determine which @Input property is "active"
     * e.g. which property value will be used.
     */
    readonly activeKey: string;
    /** Hash map of all @Input keys/values defined/used */
    readonly inputMap: {};
    /**
     * @see BaseFxDirective._mqActivation
     */
    readonly mqActivation: ResponsiveActivation;
    /**
     * BaseFxDirectiveAdapter constructor
     */
    constructor(_baseKey: string, _mediaMonitor: MediaMonitor, _elementRef: ElementRef, _renderer: Renderer2);
    /**
     * @see BaseFxDirective._queryInput
     */
    queryInput(key: any): any;
    /**
     *  Save the property value.
     */
    cacheInput(key?: string, source?: any, cacheRaw?: boolean): void;
    /**
     * @see BaseFxDirective._listenForMediaQueryChanges
     */
    listenForMediaQueryChanges(key: string, defaultValue: any, onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation;
    /**
     * No implicit transforms of the source.
     * Required when caching values expected later for KeyValueDiffers
     */
    protected _cacheInputRaw(key?: string, source?: any): void;
    /**
     *  Save the property value for Array values.
     */
    protected _cacheInputArray(key?: string, source?: boolean[]): void;
    /**
     *  Save the property value for key/value pair values.
     */
    protected _cacheInputObject(key?: string, source?: {
        [key: string]: boolean;
    }): void;
    /**
     *  Save the property value for string values.
     */
    protected _cacheInputString(key?: string, source?: string): void;
}
