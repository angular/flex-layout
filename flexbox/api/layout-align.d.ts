import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer, SimpleChanges } from '@angular/core';
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
    private _layout;
    private _layoutWatcher;
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
    private _updateWithValue(value?);
    /**
     * Cache the parent container 'flex-direction' and update the 'flex' styles
     */
    private _onLayoutChange(direction);
    private _buildCSS(align);
    /**
     * Update container element to 'stretch' as needed...
     * NOTE: this is only done if the crossAxis is explicitly set to 'stretch'
     */
    private _allowStretching(align, layout);
}
