import { ElementRef, Renderer, OnDestroy } from '@angular/core';
import { ResponsiveActivation } from '../responsive/responsive-activation';
import { MediaMonitor } from '../../media-query/media-monitor';
import { MediaQuerySubscriber } from '../../media-query/media-change';
/**
 * @internal
 *
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export declare type StyleDefinition = string | {
    [property: string]: string | number;
};
/** Abstract base class for the Layout API styling directives. */
export declare abstract class BaseFxDirective implements OnDestroy {
    private _mediaMonitor;
    protected _elementRef: ElementRef;
    private _renderer;
    /**
     * MediaQuery Activation Tracker
     */
    protected _mqActivation: ResponsiveActivation;
    /**
     *  Dictionary of input keys with associated values
     */
    protected _inputMap: {};
    /**
     *
     */
    constructor(_mediaMonitor: MediaMonitor, _elementRef: ElementRef, _renderer: Renderer);
    /**
     * Access the current value (if any) of the @Input property.
     */
    protected _queryInput(key: any): any;
    ngOnDestroy(): void;
    /**
     * Applies styles given via string pair or object map to the directive element.
     */
    protected _applyStyleToElement(style: StyleDefinition, value?: string | number, nativeElement?: any): void;
    /**
     * Applies styles given via string pair or object map to the directive element.
     */
    protected _applyStyleToElements(style: StyleDefinition, elements: HTMLElement[]): void;
    /**
     *  Save the property value; which may be a complex object.
     *  Complex objects support property chains
     */
    protected _cacheInput(key?: string, source?: any): void;
    /**
     *  Build a ResponsiveActivation object used to manage subscriptions to mediaChange notifications
     *  and intelligent lookup of the directive's property value that corresponds to that mediaQuery
     *  (or closest match).
     */
    protected _listenForMediaQueryChanges(key: string, defaultValue: any, onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation;
    /**
     * Special accessor to query for all child 'element' nodes regardless of type, class, etc.
     */
    protected readonly childrenNodes: any[];
}
