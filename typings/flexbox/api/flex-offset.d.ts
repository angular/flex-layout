import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    offset: any;
    offsetXs: any;
    offsetSm: any;
    offsetMd: any;
    offsetLg: any;
    offsetXl: any;
    offsetLtSm: any;
    offsetLtMd: any;
    offsetLtLg: any;
    offsetLtXl: any;
    offsetGtXs: any;
    offsetGtSm: any;
    offsetGtMd: any;
    offsetGtLg: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    protected _updateWithValue(value?: string | number): void;
    protected _buildCSS(offset: any): {
        'margin-left': string;
    };
}
