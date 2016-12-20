import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer, SimpleChanges } from '@angular/core';
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
    private _layout;
    private _layoutWatcher;
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
    private _onLayoutChange(direction);
    private _updateWithValue(value?);
    /**
     * Build the CSS that should be assigned to the element instance
     */
    private _buildCSS(value);
    /**
     * Convert layout-wrap="<value>" to expected flex-wrap style
     */
    private _validateValue(value);
}
