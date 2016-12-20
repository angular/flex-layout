import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-align' flexbox styling directive
 * Allows element-specific overrides for cross-axis alignments in a layout container
 * @see https://css-tricks.com/almanac/properties/a/align-self/
 */
export declare class FlexAlignDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
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
    private _buildCSS(align);
}
