import { ElementRef, Renderer2 } from '@angular/core';
import { BaseFxDirective } from './base';
import { ResponsiveActivation } from './../responsive/responsive-activation';
import { MediaQuerySubscriber } from '../../media-query/media-change';
import { MediaMonitor } from '../../media-query/media-monitor';
export declare class BaseFxDirectiveAdapter extends BaseFxDirective {
    protected _baseKey: string;
    protected _mediaMonitor: MediaMonitor;
    protected _elementRef: ElementRef;
    protected _renderer: Renderer2;
    readonly activeKey: string;
    readonly inputMap: {};
    readonly mqActivation: ResponsiveActivation;
    constructor(_baseKey: string, _mediaMonitor: MediaMonitor, _elementRef: ElementRef, _renderer: Renderer2);
    queryInput(key: any): any;
    cacheInput(key?: string, source?: any, cacheRaw?: boolean): void;
    listenForMediaQueryChanges(key: string, defaultValue: any, onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation;
    protected _cacheInputRaw(key?: string, source?: any): void;
    protected _cacheInputArray(key?: string, source?: boolean[]): void;
    protected _cacheInputObject(key?: string, source?: {
        [key: string]: boolean;
    }): void;
    protected _cacheInputString(key?: string, source?: string): void;
}
