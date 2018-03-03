/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {ElementRef} from '@angular/core';

import {BaseFxDirective} from './base';
import {ResponsiveActivation} from '../responsive-activation/responsive-activation';
import {MediaQuerySubscriber} from '../media-change';
import {MediaMonitor} from '../media-monitor/media-monitor';
import {StyleUtils} from '../style-utils/style-utils';


/**
 * Adapter to the BaseFxDirective abstract class so it can be used via composition.
 * @see BaseFxDirective
 */
export class BaseFxDirectiveAdapter extends BaseFxDirective {

  /**
   * Accessor to determine which @Input property is "active"
   * e.g. which property value will be used.
   */
  get activeKey() {
    let mqa = this._mqActivation;
    let key = mqa ? mqa.activatedInputKey : this._baseKey;
    // Note: ClassDirective::SimpleChanges uses 'klazz' instead of 'class' as a key
    return (key === 'class') ? 'klazz' : key;
  }

  /** Hash map of all @Input keys/values defined/used */
  get inputMap() {
    return this._inputMap;
  }

  /**
   * @see BaseFxDirective._mqActivation
   */
  get mqActivation(): ResponsiveActivation {
    return this._mqActivation;
  }

  /**
   * BaseFxDirectiveAdapter constructor
   */
  constructor(protected _baseKey: string,   // non-responsive @Input property name
              protected _mediaMonitor: MediaMonitor,
              protected _elementRef: ElementRef,
              protected _styler: StyleUtils) {
    super(_mediaMonitor, _elementRef, _styler);
  }

  /**
    * Does this directive have 1 or more responsive keys defined
    * Note: we exclude the 'baseKey' key (which is NOT considered responsive)
    */
  hasResponsiveAPI() {
   return super.hasResponsiveAPI(this._baseKey);
  }

  /**
   * @see BaseFxDirective._queryInput
   */
  queryInput(key) {
    return key ? this._queryInput(key) : undefined;
  }

  /**
   *  Save the property value.
   */
  cacheInput(key?: string, source?: any, cacheRaw = false) {
    if (cacheRaw) {
      this._cacheInputRaw(key, source);
    } else if (Array.isArray(source)) {
      this._cacheInputArray(key, source);
    } else if (typeof source === 'object') {
      this._cacheInputObject(key, source);
    } else if (typeof source === 'string') {
      this._cacheInputString(key, source);
    } else {
      throw new Error(
        `Invalid class value '${key}' provided. Did you want to cache the raw value?`
      );
    }
  }

  /**
   * @see BaseFxDirective._listenForMediaQueryChanges
   */
  listenForMediaQueryChanges(key: string,
                             defaultValue: any,
                             onMediaQueryChange: MediaQuerySubscriber): ResponsiveActivation {
    return this._listenForMediaQueryChanges(key, defaultValue, onMediaQueryChange);
  }

  // ************************************************************
  // Protected Methods
  // ************************************************************

  /**
   * No implicit transforms of the source.
   * Required when caching values expected later for KeyValueDiffers
   */
  protected _cacheInputRaw(key?: string, source?: any) {
    if (key) {
      this._inputMap[key] = source;
    }
  }

  /**
   *  Save the property value for Array values.
   */
  protected _cacheInputArray(key = '', source?: boolean[]) {
    this._inputMap[key] = source ? source.join(' ') : '';
  }

  /**
   *  Save the property value for key/value pair values.
   */
  protected _cacheInputObject(key = '', source?: { [key: string]: boolean }) {
    let classes: string[] = [];
    if (source) {
      for (let prop in source) {
        if (!!source[prop]) {
          classes.push(prop);
        }
      }
    }
    this._inputMap[key] = classes.join(' ');
  }

  /**
   *  Save the property value for string values.
   */
  protected _cacheInputString(key = '', source?: string) {
    this._inputMap[key] = source;
  }

}
