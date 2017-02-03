/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
/**
 * 'show' Layout API directive
 *
 */
export declare class HideDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    private _layout;
    protected elRef: ElementRef;
    protected renderer: Renderer;
    /**
     * Subscription to the parent flex container's layout changes.
     * Stored so we can unsubscribe when this directive is destroyed.
     */
    private _layoutWatcher;
    hide: any;
    hideXs: any;
    hideGtXs: any;
    hideSm: any;
    hideGtSm: any;
    hideMd: any;
    hideGtMd: any;
    hideLg: any;
    hideGtLg: any;
    hideXl: any;
    /**
     *
     */
    constructor(monitor: MediaMonitor, _layout: LayoutDirective, elRef: ElementRef, renderer: Renderer);
    /**
     * Override accessor to the current HTMLElement's `display` style
     * Note: Show/Hide will not change the display to 'flex' but will set it to 'block'
     * unless it was already explicitly defined.
     */
    protected _getDisplayStyle(): string;
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxHide')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     * NOTE: fxHide has special fallback defaults.
     *       - If the non-responsive fxHide="" is specified we default to hide==true
     *       - If the non-responsive fxHide is NOT specified, use default hide == false
     *       This logic supports mixed usages with fxShow; e.g. `<div fxHide fxShow.gt-sm>`
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Validate the visibility value and then update the host's inline display style
     */
    private _updateWithValue(value?);
    /**
     * Build the CSS that should be assigned to the element instance
     */
    private _buildCSS(value);
    /**
     * Validate the value to NOT be FALSY
     */
    private _validateTruthy(value);
}
