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
import { LayoutWrapDirective } from './layout-wrap';
/** Built-in aliases for different flex-basis values. */
export declare type FlexBasisAlias = 'grow' | 'initial' | 'auto' | 'none' | 'nogrow' | 'noshrink';
/**
 * Directive to control the size of a flex item using flex-basis, flex-grow, and flex-shrink.
 * Corresponds to the css `flex` shorthand property.
 *
 * @see https://css-tricks.com/snippets/css/a-guide-to-flexbox/
 */
export declare class FlexDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _container: LayoutDirective;
    protected _wrap: LayoutWrapDirective;
    /** The flex-direction of this element's flex container. Defaults to 'row'. */
    protected _layout: string;
    /**
     * Subscription to the parent flex container's layout changes.
     * Stored so we can unsubscribe when this directive is destroyed.
     */
    protected _layoutWatcher: Subscription;
    flex: any;
    shrink: any;
    grow: any;
    flexXs: any;
    flexGtXs: any;
    flexSm: any;
    flexGtSm: any;
    flexMd: any;
    flexGtMd: any;
    flexLg: any;
    flexGtLg: any;
    flexXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer, _container: LayoutDirective, _wrap: LayoutWrapDirective);
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    ngOnDestroy(): void;
    /**
     * Caches the parent container's 'flex-direction' and updates the element's style.
     * Used as a handler for layout change events from the parent flex container.
     */
    protected _onLayoutChange(direction?: string): void;
    protected _updateStyle(value?: string | number): void;
    /**
     * If the used the short-form `fxFlex="1 0 37%"`, then parse the parts
     */
    protected _parseFlexParts(basis: string): any[];
    /**
     * Extract more complicated short-hand versions.
     * e.g.
     * fxFlex="3 3 calc(15em + 20px)"
     */
    protected _getPartsWithCalc(value: string): any[];
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of "row"
     */
    protected _validateValue(grow: number | string, shrink: number | string, basis: string | number | FlexBasisAlias): any;
}
