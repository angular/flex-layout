import { ElementRef, OnDestroy, SimpleChanges, OnChanges, Renderer } from '@angular/core';
import { ResponsiveActivation } from '../responsive/responsive-activation';
import { MediaMonitor } from '../../media-query/media-monitor';
import { MediaQuerySubscriber } from '../../media-query/media-change';
export declare type StyleDefinition = string | {
    [property: string]: string | number;
};
export declare abstract class BaseFxDirective implements OnDestroy, OnChanges {
    protected _mediaMonitor: MediaMonitor;
    protected _elementRef: ElementRef;
    protected _renderer: Renderer;
    readonly hasMediaQueryListener: boolean;
    activatedValue: string | number;
    constructor(_mediaMonitor: MediaMonitor, _elementRef: ElementRef, _renderer: Renderer);
    protected _queryInput(key: any): any;
    ngOnChanges(change: SimpleChanges): void;
    ngOnDestroy(): void;
    protected _getDefaultVal(key: string, fallbackVal: any): string | boolean;
    protected _getDisplayStyle(source?: HTMLElement): string;
    protected _getFlowDirection(target: any, addIfMissing?: boolean): string;
    protected _applyMultiValueStyleToElement(styles: {}, element: any): void;
    protected _applyStyleToElement(style: StyleDefinition, value?: string | number, nativeElement?: any): void;
    protected _applyStyleToElements(style: StyleDefinition, elements: HTMLElement[]): void;
    protected _cacheInput(key?: string, source?: any): void;
    protected _listenForMediaQueryChanges(key: string, defaultValue: any, onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation;
    protected readonly childrenNodes: any[];
    protected hasKeyValue(key: any): boolean;
    protected _display: any;
    protected _mqActivation: ResponsiveActivation;
    protected _inputMap: {};
}
