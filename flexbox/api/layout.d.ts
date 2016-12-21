import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare const LAYOUT_VALUES: string[];
/**
 * 'layout' flexbox styling directive
 * Defines the positioning flow direction for the child elements: row or column
 * Optional values: column or row (default)
 * @see https://css-tricks.com/almanac/properties/f/flex-direction/
 *
 */
export declare class LayoutDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    /**
     * Create Observable for nested/child 'flex' directives. This allows
     * child flex directives to subscribe/listen for flexbox direction changes.
     */
    private _announcer;
    /**
     * Publish observer to enabled nested, dependent directives to listen
     * to parent "layout" direction changes
     */
    layout$: Observable<string>;
    layout: any;
    layoutXs: any;
    layoutGtXs: any;
    layoutSm: any;
    layoutGtSm: any;
    layoutMd: any;
    layoutGtMd: any;
    layoutLg: any;
    layoutGtLg: any;
    layoutXl: any;
    /**
     *
     */
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer);
    /**
     * On changes to any @Input properties...
     * Default to use the non-responsive Input value ('fxLayout')
     * Then conditionally override with the mq-activated Input's current value
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    /**
     * Validate the direction value and then update the host's inline flexbox styles
     */
    private _updateWithDirection(direction?);
    /**
     * Build the CSS that should be assigned to the element instance
     * BUG:
     *
     *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
     *      Use height instead if possible; height : <xxx>vh;
     *
     * @todo - update all child containers to have "box-sizing: border-box"
     *         This way any padding or border specified on the child elements are
     *         laid out and drawn inside that element's specified width and height.
     *
     */
    private _buildCSS(value);
    /**
     * Validate the value to be one of the acceptable value options
     * Use default fallback of "row"
     */
    private _validateValue(value);
}
