/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
/**
 * 'layout-align' flexbox styling directive
 *  Defines positioning of child elements along main and cross axis in a layout container
 *  Optional values: {main-axis} values or {main-axis cross-axis} value pairs
 *
 *  @see https://css-tricks.com/almanac/properties/j/justify-content/
 *  @see https://css-tricks.com/almanac/properties/a/align-items/
 *  @see https://css-tricks.com/almanac/properties/a/align-content/
 */
export declare class LayoutAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _layout: string;
    protected _layoutWatcher: Subscription;
    align: any;
    alignXs: any;
    alignGtXs: any;
    alignSm: any;
    alignGtSm: any;
    alignMd: any;
    alignGtMd: any;
    alignLg: any;
    alignGtLg: any;
    alignXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer, container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     *
     */
    protected _updateWithValue(value?: string): void;
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    protected _onLayoutChange(direction: any): void;
    protected _buildCSS(align: any): any;
    /**
     * Update container element to 'stretch' as needed...
     * NOTE: this is only done if the crossAxis is explicitly set to 'stretch'
     */
    protected _allowStretching(align: any, layout: any): void;
}
