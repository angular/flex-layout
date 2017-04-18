/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BaseFxDirective } from './base';
import { LayoutDirective } from './layout';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * @deprecated
 * This functionality is now part of the `fxLayout` API
 *
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 *
 *
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
export declare class LayoutWrapDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _layout: string;
    protected _layoutWatcher: Subscription;
    wrap: any;
    wrapXs: any;
    wrapSm: any;
    wrapMd: any;
    wrapLg: any;
    wrapXl: any;
    wrapGtXs: any;
    wrapGtSm: any;
    wrapGtMd: any;
    wrapGtLg: any;
    wrapLtSm: any;
    wrapLtMd: any;
    wrapLtLg: any;
    wrapLtXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2, container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    protected _onLayoutChange(direction: any): void;
    protected _updateWithValue(value?: string): void;
    /**
     * Build the CSS that should be assigned to the element instance
     */
    protected _buildCSS(value: any): {
        'display': string;
        'flex-wrap': any;
        'flex-direction': string;
    };
    protected readonly flowDirection: string;
}
