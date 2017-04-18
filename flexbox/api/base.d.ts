/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { ResponsiveActivation } from '../responsive/responsive-activation';
import { MediaMonitor } from '../../media-query/media-monitor';
import { MediaQuerySubscriber } from '../../media-query/media-change';
/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export declare type StyleDefinition = string | {
    [property: string]: string | number;
};
/** Abstract base class for the Layout API styling directives. */
export declare abstract class BaseFxDirective implements OnDestroy {
    protected _mediaMonitor: MediaMonitor;
    protected _elementRef: ElementRef;
    protected _renderer: Renderer2;
    readonly hasMediaQueryListener: boolean;
    /**
     *
     */
    constructor(_mediaMonitor: MediaMonitor, _elementRef: ElementRef, _renderer: Renderer2);
    /**
     * Access the current value (if any) of the @Input property.
     */
    protected _queryInput(key: any): any;
    ngOnDestroy(): void;
    /**
     * Was the directive's default selector used ?
     * If not, use the fallback value!
     */
    protected _getDefaultVal(key: string, fallbackVal: any): string | boolean;
    /**
     * Quick accessor to the current HTMLElement's `display` style
     * Note: this allows use to preserve the original style
     * and optional restore it when the mediaQueries deactivate
     */
    protected _getDisplayStyle(source?: HTMLElement): string;
    protected _getFlowDirection(target: any, addIfMissing?: boolean): string;
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
    /**
     * Fast validator for presence of attribute on the host element
     */
    protected hasKeyValue(key: any): boolean;
    /** Original dom Elements CSS display style */
    protected _display: any;
    /**
     * MediaQuery Activation Tracker
     */
    protected _mqActivation: ResponsiveActivation;
    /**
     *  Dictionary of input keys with associated values
     */
    protected _inputMap: {};
}
