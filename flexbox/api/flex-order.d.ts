import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-order' flexbox styling directive
 * Configures the positional ordering of the element in a sorted layout container
 * @see https://css-tricks.com/almanac/properties/o/order/
 */
export declare class FlexOrderDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    order: any;
    orderXs: any;
    orderGtXs: any;
    orderSm: any;
    orderGtSm: any;
    orderMd: any;
    orderGtMd: any;
    orderLg: any;
    orderGtLg: any;
    orderXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer);
    /**
     * For @Input changes on the current mq activation property, see onMediaQueryChanges()
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngOnInit(): void;
    private _updateWithValue(value?);
    private _buildCSS(value);
}
