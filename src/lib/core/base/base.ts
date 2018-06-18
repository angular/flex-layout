/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  ElementRef,
  OnDestroy,
  SimpleChanges,
  OnChanges,
  SimpleChange,
} from '@angular/core';

import {buildLayoutCSS} from '../../utils/layout-validator';
import {
  StyleDefinition,
  StyleUtils,
} from '../style-utils/style-utils';
import {ResponsiveActivation, KeyOptions} from '../responsive-activation/responsive-activation';
import {MediaMonitor} from '../media-monitor/media-monitor';
import {MediaQuerySubscriber} from '../media-change';

/** Abstract base class for the Layout API styling directives. */
export abstract class BaseDirective implements OnDestroy, OnChanges {
  get hasMediaQueryListener() {
    return !!this._mqActivation;
  }

  /**
   * Imperatively determine the current activated [input] value;
   * if called before ngOnInit() this will return `undefined`
   */
  get activatedValue(): string | number {
    return this._mqActivation ? this._mqActivation.activatedInput : undefined;
  }

  /**
   * Change the currently activated input value and force-update
   * the injected CSS (by-passing change detection).
   *
   * NOTE: Only the currently activated input value will be modified;
   *       other input values will NOT be affected.
   */
  set activatedValue(value: string | number) {
    let key = 'baseKey', previousVal;

    if (this._mqActivation) {
      key = this._mqActivation.activatedInputKey;
      previousVal = this._inputMap[key];
      this._inputMap[key] = value;
    }
    let change = new SimpleChange(previousVal, value, false);

    this.ngOnChanges({[key]: change} as SimpleChanges);
  }

  protected constructor(protected _mediaMonitor: MediaMonitor,
                        protected _elementRef: ElementRef,
                        protected _styler: StyleUtils) {
  }

  /**
   * Does this directive have 1 or more responsive keys defined
   * Note: we exclude the 'baseKey' key (which is NOT considered responsive)
   */
  hasResponsiveAPI(baseKey: string) {
    const totalKeys = Object.keys(this._inputMap).length;
    const baseValue = this._inputMap[baseKey];
    return (totalKeys - (!!baseValue ? 1 : 0)) > 0;
  }

  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * Use post-component-initialization event to perform extra
   * querying such as computed Display style
   */
  ngOnInit() {
    this._hasInitialized = true;
  }

  ngOnChanges(change: SimpleChanges) {
    throw new Error(`BaseDirective::ngOnChanges should be overridden in subclass: ${change}`);
  }

  ngOnDestroy() {
    if (this._mqActivation) {
      this._mqActivation.destroy();
    }
    delete this._mediaMonitor;
  }

  // *********************************************
  // Protected Methods
  // *********************************************

  /** Access to host element's parent DOM node */
  protected get parentElement(): any {
    return this._elementRef.nativeElement.parentNode;
  }

  protected get nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }

  /** Access the current value (if any) of the @Input property */
  protected _queryInput(key) {
    return this._inputMap[key];
  }

  /**
   * Was the directive's default selector used ?
   * If not, use the fallback value!
   */
  protected _getDefaultVal(key: string, fallbackVal: any): string | boolean {
    let val = this._queryInput(key);
    let hasDefaultVal = (val !== undefined && val !== null);
    return (hasDefaultVal && val !== '') ? val : fallbackVal;
  }

  /**
   * Quick accessor to the current HTMLElement's `display` style
   * Note: this allows us to preserve the original style
   * and optional restore it when the mediaQueries deactivate
   */
  protected _getDisplayStyle(source: HTMLElement = this.nativeElement): string {
    const query = 'display';
    return this._styler.lookupStyle(source, query);
  }

  /** Quick accessor to raw attribute value on the target DOM element */
  protected _getAttributeValue(attribute: string,
                               source: HTMLElement = this.nativeElement): string {
    return this._styler.lookupAttributeValue(source, attribute);
  }

  /**
   * Determine the DOM element's Flexbox flow (flex-direction).
   *
   * Check inline style first then check computed (stylesheet) style.
   * And optionally add the flow value to element's inline style.
   */
  protected _getFlexFlowDirection(target: HTMLElement, addIfMissing = false): string {
    let value = 'row';
    let hasInlineValue = '';

    if (target) {
      [value, hasInlineValue] = this._styler.getFlowDirection(target);

      if (!hasInlineValue && addIfMissing) {
        const style = buildLayoutCSS(value);
        const elements = [target];
        this._styler.applyStyleToElements(style, elements);
      }
    }

    return value.trim() || 'row';
  }

  /** Applies styles given via string pair or object map to the directive element */
  protected _applyStyleToElement(style: StyleDefinition,
                                 value?: string | number,
                                 element: HTMLElement = this.nativeElement) {
    this._styler.applyStyleToElement(element, style, value);
  }

  /** Applies styles given via string pair or object map to the directive's element */
  protected _applyStyleToElements(style: StyleDefinition, elements: HTMLElement[]) {
    this._styler.applyStyleToElements(style, elements);
  }

  /**
   *  Save the property value; which may be a complex object.
   *  Complex objects support property chains
   */
  protected _cacheInput(key?: string, source?: any) {
    if (typeof source === 'object') {
      for (let prop in source) {
        this._inputMap[prop] = source[prop];
      }
    } else {
      if (!!key) {
        this._inputMap[key] = source;
      }
    }
  }

  /**
   *  Build a ResponsiveActivation object used to manage subscriptions to mediaChange notifications
   *  and intelligent lookup of the directive's property value that corresponds to that mediaQuery
   *  (or closest match).
   */
  protected _listenForMediaQueryChanges(key: string,
                                        defaultValue: any,
                                        onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation { // tslint:disable-line:max-line-length
    if (!this._mqActivation) {
      let keyOptions = new KeyOptions(key, defaultValue, this._inputMap);
      this._mqActivation = new ResponsiveActivation(keyOptions, this._mediaMonitor,
        (change) => onMediaQueryChange(change));
    }
    return this._mqActivation;
  }

  /** Special accessor to query for all child 'element' nodes regardless of type, class, etc */
  protected get childrenNodes() {
    const obj = this.nativeElement.children;
    const buffer: any[] = [];

    // iterate backwards ensuring that length is an UInt32
    for (let i = obj.length; i--; ) {
      buffer[i] = obj[i];
    }
    return buffer;
  }

  /** Fast validator for presence of attribute on the host element */
  protected hasKeyValue(key) {
    return this._mqActivation.hasKeyValue(key);
  }

  protected get hasInitialized() {
    return this._hasInitialized;
  }

  /** MediaQuery Activation Tracker */
  protected _mqActivation: ResponsiveActivation;

  /** Dictionary of input keys with associated values */
  protected _inputMap = {};

  /**
   * Has the `ngOnInit()` method fired
   *
   * Used to allow *ngFor tasks to finish and support queries like
   * getComputedStyle() during ngOnInit().
   */
  protected _hasInitialized = false;
}
