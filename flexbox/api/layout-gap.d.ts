import { ElementRef, OnChanges, Renderer, SimpleChanges, AfterContentInit } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'layout-padding' styling directive
 *  Defines padding of child elements in a layout container
 */
export declare class LayoutGapDirective extends BaseFxDirective implements AfterContentInit, OnChanges {
    gap: any;
    gapXs: any;
    gapGtXs: any;
    gapSm: any;
    gapGtSm: any;
    gapMd: any;
    gapGtMd: any;
    gapLg: any;
    gapGtLg: any;
    gapXl: any;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer);
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * After the initial onChanges, build an mqActivation object that bridges
     * mql change events to onMediaQueryChange handlers
     */
    ngAfterContentInit(): void;
    /**
     *
     */
    private _updateWithValue(value?);
    private _buildCSS(value);
}
