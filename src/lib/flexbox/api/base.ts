/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  ElementRef, OnDestroy, SimpleChanges, OnChanges,
  SimpleChange, Renderer2
} from '@angular/core';

import {buildLayoutCSS} from '../../utils/layout-validator';
import {
  StyleDefinition,
  lookupStyle,
  lookupInlineStyle,
  applyStyleToElement,
  applyStyleToElements
} from '../../utils/style-utils';

import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';
import {MediaMonitor} from '../../media-query/media-monitor';
import {MediaQuerySubscriber} from '../../media-query/media-change';

/** Abstract base class for the Layout API styling directives. */
export abstract class BaseFxDirective implements OnDestroy, OnChanges {

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


  /**
   * Constructor
   */
  constructor(protected _mediaMonitor: MediaMonitor,
              protected _elementRef: ElementRef,
              protected _renderer: Renderer2) {
  }

  // *********************************************
  // Accessor Methods
  // *********************************************

  /**
   * Access to host element's parent DOM node
   */
  protected get parentElement(): any {
    return this._elementRef.nativeElement.parentNode;
  }

  protected get nativeElement(): any {
    return this._elementRef.nativeElement;
  }

  /**
   * Access the current value (if any) of the @Input property.
   */
  protected _queryInput(key) {
    return this._inputMap[key];
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

  /**
   * Use post-component-initialization event to perform extra
   * querying such as computed Display style
   */
  ngOnInit() {
    this._display = this._getDisplayStyle();
    this._hasInitialized = true;
  }

  ngOnChanges(change: SimpleChanges) {
    throw new Error(`BaseFxDirective::ngOnChanges should be overridden in subclass: ${change}`);
  }

  ngOnDestroy() {
    if (this._mqActivation) {
      this._mqActivation.destroy();
    }
    this._mediaMonitor = null;
  }

  // *********************************************
  // Protected Methods
  // *********************************************

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
   * Note: this allows use to preserve the original style
   * and optional restore it when the mediaQueries deactivate
   */
  protected _getDisplayStyle(source?: HTMLElement): string {
    let element: HTMLElement = source || this.nativeElement;
    return lookupStyle(element, 'display');
  }

  /**
   * Determine the DOM element's Flexbox flow (flex-direction).
   *
   * Check inline style first then check computed (stylesheet) style.
   * And optionally add the flow value to element's inline style.
   */
  protected _getFlowDirection(target: any, addIfMissing = false): string {
    let value = 'row';

    if (target) {
      value = lookupStyle(target, 'flex-direction') || 'row';
      let hasInlineValue = lookupInlineStyle(target, 'flex-direction');

      if (!hasInlineValue && addIfMissing) {
        applyStyleToElements(this._renderer, buildLayoutCSS(value), [target]);
      }
    }

    return value.trim();
  }

  /**
   * Applies styles given via string pair or object map to the directive element.
   */
  protected _applyStyleToElement(style: StyleDefinition,
                                 value?: string | number,
                                 nativeElement?: any) {
    let element = nativeElement || this.nativeElement;
    applyStyleToElement(this._renderer, element, style, value);
  }

  /**
   * Applies styles given via string pair or object map to the directive's element.
   */
  protected _applyStyleToElements(style: StyleDefinition, elements: HTMLElement[ ]) {
    applyStyleToElements(this._renderer, style, elements || []);
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
      this._inputMap[key] = source;
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
      this._mqActivation = new ResponsiveActivation(
          keyOptions,
          this._mediaMonitor,
          (change) => onMediaQueryChange(change)
      );
    }
    return this._mqActivation;
  }

  /**
   * Special accessor to query for all child 'element' nodes regardless of type, class, etc.
   */
  protected get childrenNodes() {
    const obj = this.nativeElement.children;
    const buffer = [];

    // iterate backwards ensuring that length is an UInt32
    for (let i = obj.length; i--; ) {
      buffer[i] = obj[i];
    }
    return buffer;
  }

  /**
   * Fast validator for presence of attribute on the host element
   */
  protected hasKeyValue(key) {
    return this._mqActivation.hasKeyValue(key);
  }

  protected get hasInitialized() {
    return this._hasInitialized;
  }

  /** Original dom Elements CSS display style */
  protected _display;

  /**
   * MediaQuery Activation Tracker
   */
  protected _mqActivation: ResponsiveActivation;

  /**
   *  Dictionary of input keys with associated values
   */
  protected _inputMap = {};

  /**
   * Has the `ngOnInit()` method fired
   *
   * Used to allow *ngFor tasks to finish and support queries like
   * getComputedStyle() during ngOnInit().
   */
  protected _hasInitialized = false;
}
