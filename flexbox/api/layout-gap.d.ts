/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnChanges, Renderer, SimpleChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export declare class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges, OnDestroy {
    private _layout;
    private _layoutWatcher;
    gap: any;
    gapXs: any;
    gapGtXs: any;
    gapSm: any;
    gapGtSm: any;
    gapMd: any;
    gapGtMd: any;
    gapLg: any;
    gapGtLg: any;
    gapXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer, container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    /**
     * Cache the parent container 'flex-direction' and update the 'margin' styles
     */
    private _onLayoutChange(direction);
    /**
     *
     */
    private _updateWithValue(value?);
    private _buildCSS(value);
}
