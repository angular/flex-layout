import { ElementRef, OnInit, OnChanges, Renderer2 } from '@angular/core';
import { BaseFxDirective } from '../core/base';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare class ImgSrcDirective extends BaseFxDirective implements OnInit, OnChanges {
    srcBase: any;
    srcXs: any;
    srcSm: any;
    srcMd: any;
    srcLg: any;
    srcXl: any;
    srcLtSm: any;
    srcLtMd: any;
    srcLtLg: any;
    srcLtXl: any;
    srcGtXs: any;
    srcGtSm: any;
    srcGtMd: any;
    srcGtLg: any;
    constructor(elRef: ElementRef, renderer: Renderer2, monitor: MediaMonitor);
    ngOnInit(): void;
    ngOnChanges(): void;
    protected _updateSrcFor(): void;
    protected cacheDefaultSrc(value?: string): void;
    protected readonly defaultSrc: string;
    protected readonly hasResponsiveKeys: boolean;
}
