/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  ElementRef, OnDestroy, SimpleChanges, OnChanges,
  SimpleChange, Renderer
} from '@angular/core';
import {ɵgetDOM as getDom} from '@angular/platform-browser';

import {applyCssPrefixes} from '../../utils/auto-prefixer';
import {buildLayoutCSS} from '../../utils/layout-validator';

import {ResponsiveActivation, KeyOptions} from '../responsive/responsive-activation';
import {MediaMonitor} from '../../media-query/media-monitor';
import {MediaQuerySubscriber} from '../../media-query/media-change';

/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export type StyleDefinition = string | { [property: string]: string | number };

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
              protected _renderer: Renderer) {
    this._display = this._getDisplayStyle();
  }

  // *********************************************
  // Accessor Methods
  // *********************************************

  /**
   * Access the current value (if any) of the @Input property.
   */
  protected _queryInput(key) {
    return this._inputMap[key];
  }


  // *********************************************
  // Lifecycle Methods
  // *********************************************

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
    let element: HTMLElement = source || this._elementRef.nativeElement;
    let value = this._lookupStyle(element, 'display');

    return value ? value.trim() :
        ((element.nodeType === 1) ? 'block' : 'inline-block');
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
      value = this._lookupStyle(target, 'flex-direction') || 'row';

      let hasInlineValue = getDom().getStyle(target, 'flex-direction');
      if (!hasInlineValue && addIfMissing) {
        this._applyStyleToElements(buildLayoutCSS(value), [target]);
      }
    }

    return value.trim();
  }

  /**
   * Determine the inline or inherited CSS style
   */
  protected _lookupStyle(element: HTMLElement, styleName: string): any {
    let value = '';
    try {
      if (element) {
        let immediateValue = getDom().getStyle(element, styleName);
        value = immediateValue || getDom().getComputedStyle(element).getPropertyValue(styleName);
      }
    } catch (e) {
      // TODO: platform-server throws an exception for getComputedStyle
    }
    return value;
  }

  /**
   * Applies the styles to the element. The styles object map may contain an array of values. Each
   * value will be added as element style.
   */
  protected _applyMultiValueStyleToElement(styles: {}, element: any) {
    Object.keys(styles).forEach(key => {
      const values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
      for (let value of values) {
        this._renderer.setElementStyle(element, key, value);
      }
    });
  }

  /**
   * Applies styles given via string pair or object map to the directive element.
   */
  protected _applyStyleToElement(style: StyleDefinition,
                                 value?: string | number,
                                 nativeElement?: any) {
    let styles = {};
    let element = nativeElement || this._elementRef.nativeElement;

    if (typeof style === 'string') {
      styles[style] = value;
      style = styles;
    }

    styles = applyCssPrefixes(style);

    this._applyMultiValueStyleToElement(styles, element);
  }

  /**
   * Applies styles given via string pair or object map to the directive element.
   */
  protected _applyStyleToElements(style: StyleDefinition, elements: HTMLElement[ ]) {
    let styles = applyCssPrefixes(style);

    elements.forEach(el => {
      this._applyMultiValueStyleToElement(styles, el);
    });
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
    const obj = this._elementRef.nativeElement.children;
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

}
