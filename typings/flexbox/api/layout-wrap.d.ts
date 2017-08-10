import { ElementRef, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BaseFxDirective } from './base';
import { LayoutDirective } from './layout';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare class LayoutWrapDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _layout: string;
    protected _layoutWatcher: Subscription;
    wrap: any;
    wrapXs: any;
    wrapSm: any;
    wrapMd: any;
    wrapLg: any;
    wrapXl: any;
    wrapGtXs: any;
    wrapGtSm: any;
    wrapGtMd: any;
    wrapGtLg: any;
    wrapLtSm: any;
    wrapLtMd: any;
    wrapLtLg: any;
    wrapLtXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2, container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected _onLayoutChange(direction: any): void;
    protected _updateWithValue(value?: string): void;
    protected _buildCSS(value: any): {
        'display': string;
        'flex-wrap': any;
        'flex-direction': string;
    };
    protected readonly flowDirection: string;
}
