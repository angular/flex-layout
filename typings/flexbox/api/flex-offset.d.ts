import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
import { LayoutDirective } from './layout';
export declare class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    protected _container: LayoutDirective;
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
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2, _container: LayoutDirective);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    protected _layout: string;
    protected _layoutWatcher: Subscription;
    protected watchParentFlow(): void;
    protected _onLayoutChange(direction?: string): void;
    protected _updateWithValue(value?: string | number): void;
    protected _buildCSS(offset: any): {
        'margin-left': string;
    } | {
        'margin-top': string;
    };
}
