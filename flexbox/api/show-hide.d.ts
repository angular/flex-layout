/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
/**
 * For fxHide selectors, we invert the 'value'
 * and assign to the equivalent fxShow selector cache
 *  - When 'hide' === '' === true, do NOT show the element
 *  - When 'hide' === false or 0... we WILL show the element
 */
export declare function negativeOf(hide: any): boolean;
/**
 * 'show' Layout API directive
 *
 */
export declare class ShowHideDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _layout: LayoutDirective;
    protected elRef: ElementRef;
    protected renderer: Renderer;
    /**
     * Subscription to the parent flex container's layout changes.
     * Stored so we can unsubscribe when this directive is destroyed.
     */
    protected _layoutWatcher: Subscription;
    show: any;
    hide: any;
    showXs: any;
    hideXs: any;
    showGtXs: any;
    hideGtXs: any;
    showSm: any;
    hideSm: any;
    showGtSm: any;
    hideGtSm: any;
    showMd: any;
    hideMd: any;
    showGtMd: any;
    hideGtMd: any;
    showLg: any;
    hideLg: any;
    showGtLg: any;
    hideGtLg: any;
    showXl: any;
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
     * Default to use the non-responsive Input value ('fxShow')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Validate the visibility value and then update the host's inline display style */
    protected _updateWithValue(value?: string | number | boolean): void;
    /** Build the CSS that should be assigned to the element instance */
    protected _buildCSS(show: any): {
        'display': any;
    };
    /**  Validate the to be not FALSY */
    _validateTruthy(show: any): boolean;
}
