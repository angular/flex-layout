/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnChanges, Renderer2, SimpleChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BaseFxDirective } from './base';
import { LayoutDirective } from './layout';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export declare class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges, OnDestroy {
    protected _layout: string;
    protected _layoutWatcher: Subscription;
    protected _observer: MutationObserver;
    gap: any;
    gapXs: any;
    gapSm: any;
    gapMd: any;
    gapLg: any;
    gapXl: any;
    gapGtXs: any;
    gapGtSm: any;
    gapGtMd: any;
    gapGtLg: any;
    gapLtSm: any;
    gapLtMd: any;
    gapLtLg: any;
    gapLtXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2, container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Watch for child nodes to be added... and apply the layout gap styles to each.
     * NOTE: this does NOT! differentiate between viewChildren and contentChildren
     */
    protected _watchContentChanges(): void;
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     */
    protected _onLayoutChange(direction: any): void;
    /**
     *
     */
    protected _updateWithValue(value?: string): void;
    /**
     * Prepare margin CSS, remove any previous explicitly
     * assigned margin assignments
     */
    private _buildCSS(value?);
}
