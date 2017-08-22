import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare class FlexOrderDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    order: any;
    orderXs: any;
    orderSm: any;
    orderMd: any;
    orderLg: any;
    orderXl: any;
    orderGtXs: any;
    orderGtSm: any;
    orderGtMd: any;
    orderGtLg: any;
    orderLtSm: any;
    orderLtMd: any;
    orderLtLg: any;
    orderLtXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    protected _updateWithValue(value?: string): void;
    protected _buildCSS(value: any): {
        order: any;
    };
}
