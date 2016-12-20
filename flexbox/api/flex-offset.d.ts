import { ElementRef, OnInit, OnChanges, OnDestroy, Renderer, SimpleChanges } from '@angular/core';
import { BaseFxDirective } from './base';
import { MediaMonitor } from '../../media-query/media-monitor';
/**
 * 'flex-offset' flexbox styling directive
 * Configures the 'margin-left' of the element in a layout container
 */
export declare class FlexOffsetDirective extends BaseFxDirective implements OnInit, OnChanges, OnDestroy {
    offset: any;
    offsetXs: any;
    offsetGtXs: any;
    offsetSm: any;
    offsetGtSm: any;
    offsetMd: any;
    offsetGtMd: any;
    offsetLg: any;
    offsetGtLg: any;
    offsetXl: any;
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
    private _buildCSS(offset);
}
