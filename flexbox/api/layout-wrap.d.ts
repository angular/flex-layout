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
 * 'layout-wrap' flexbox styling directive
 * Defines wrapping of child elements in layout container
 * Optional values: reverse, wrap-reverse, none, nowrap, wrap (default)]
 * @see https://css-tricks.com/almanac/properties/f/flex-wrap/
 */
export declare class LayoutWrapDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _layout: string;
    protected _layoutWatcher: Subscription;
    wrap: any;
    wrapXs: any;
    wrapGtXs: any;
    wrapSm: any;
    wrapGtSm: any;
    wrapMd: any;
    wrapGtMd: any;
    wrapLg: any;
    wrapGtLg: any;
    wrapXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer, container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    protected _onLayoutChange(direction: any): void;
    protected _updateWithValue(value?: string): void;
    /**
     * Build the CSS that should be assigned to the element instance
     */
    protected _buildCSS(value: any): any;
    /**
     * Convert layout-wrap="<value>" to expected flex-wrap style
     */
    protected _validateValue(value: any): any;
}
