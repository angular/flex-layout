import { ElementRef, Renderer } from '@angular/core';
import { MediaMonitor } from '../../media-query/media-monitor';
import { BaseFxDirective } from './base';
/**
 * 'fxFill' flexbox styling directive
 *  Maximizes width and height of element in a layout container
 *
 *  NOTE: fxFill is NOT responsive API!!
 */
export declare class FlexFillDirective extends BaseFxDirective {
    elRef: ElementRef;
    renderer: Renderer;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer);
}
