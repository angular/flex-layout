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
import { MediaChange } from '../../media-query/media-change';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
import { HideDirective } from './hide';
/**
 * 'show' Layout API directive
 *
 */
export declare class ShowDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _layout: LayoutDirective;
    protected _hide: HideDirective;
    protected elRef: ElementRef;
    protected renderer: Renderer;
    /**
     * Subscription to the parent flex container's layout changes.
     * Stored so we can unsubscribe when this directive is destroyed.
     */
    protected _layoutWatcher: Subscription;
    show: any;
    showXs: any;
    showGtXs: any;
    showSm: any;
    showGtSm: any;
    showMd: any;
    showGtMd: any;
    showLg: any;
    showGtLg: any;
    showXl: any;
    /**
     *
     */
    constructor(monitor: MediaMonitor, _layout: LayoutDirective, _hide: HideDirective, elRef: ElementRef, renderer: Renderer);
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
    /**
     * If deactiving Show, then delegate action to the Hide directive if it is
     * specified on same element.
     */
    protected _delegateToHide(changes?: MediaChange): boolean;
    /** Validate the visibility value and then update the host's inline display style */
    protected _updateWithValue(value?: string | number | boolean): void;
    /** Build the CSS that should be assigned to the element instance */
    protected _buildCSS(show: any): {
        'display': any;
    };
    /**  Validate the to be not FALSY */
    _validateTruthy(show: any): boolean;
}
