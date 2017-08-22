import { ElementRef, Renderer2 } from '@angular/core';
import { MediaMonitor } from '../../media-query/media-monitor';
import { BaseFxDirective } from './base';
export declare class FlexFillDirective extends BaseFxDirective {
    elRef: ElementRef;
    renderer: Renderer2;
    constructor(monitor: MediaMonitor, elRef: ElementRef, renderer: Renderer2);
}
