/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

import {applyCssPrefixes} from '../../utils/auto-prefixer';
import {StylesheetMap} from '../stylesheet-map/stylesheet-map';
import {SERVER_TOKEN} from '../tokens/server-token';
import {LAYOUT_CONFIG, LayoutConfigOptions} from '../tokens/library-config';

@Injectable({providedIn: 'root'})
export class StyleUtils {

  constructor(private _serverStylesheet: StylesheetMap,
              @Inject(SERVER_TOKEN) private _serverModuleLoaded: boolean,
              @Inject(PLATFORM_ID) private _platformId: Object,
              @Inject(LAYOUT_CONFIG) private layoutConfig: LayoutConfigOptions) {}

  /**
   * Applies styles given via string pair or object map to the directive element
   */
  applyStyleToElement(element: HTMLElement,
                      style: StyleDefinition | string,
                      value: string | number | null = null) {
    let styles: StyleDefinition = {};
    if (typeof style === 'string') {
      styles[style] = value;
      style = styles;
    }
    styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
    this._applyMultiValueStyleToElement(styles, element);
  }

  /**
   * Applies styles given via string pair or object map to the directive's element
   */
  applyStyleToElements(style: StyleDefinition, elements: HTMLElement[] = []) {
    const styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
    elements.forEach(el => {
      this._applyMultiValueStyleToElement(styles, el);
    });
  }

  /**
   * Determine the DOM element's Flexbox flow (flex-direction)
   *
   * Check inline style first then check computed (stylesheet) style
   */
  getFlowDirection(target: HTMLElement): [string, string] {
    const query = 'flex-direction';
    let value = this.lookupStyle(target, query);
    const hasInlineValue = this.lookupInlineStyle(target, query) ||
    (isPlatformServer(this._platformId) && this._serverModuleLoaded) ? value : '';

    return [value || 'row', hasInlineValue];
  }

  hasWrap(target: HTMLElement): boolean {
    const query = 'flex-wrap';
    return this.lookupStyle(target, query) === 'wrap';
  }

  /**
   * Find the DOM element's raw attribute value (if any)
   */
  lookupAttributeValue(element: HTMLElement, attribute: string): string {
    return element.getAttribute(attribute) || '';
  }

  /**
   * Find the DOM element's inline style value (if any)
   */
  lookupInlineStyle(element: HTMLElement, styleName: string): string {
    return isPlatformBrowser(this._platformId) ?
      element.style.getPropertyValue(styleName) : this._getServerStyle(element, styleName);
  }

  /**
   * Determine the inline or inherited CSS style
   * NOTE: platform-server has no implementation for getComputedStyle
   */
  lookupStyle(element: HTMLElement, styleName: string, inlineOnly = false): string {
    let value = '';
    if (element) {
      let immediateValue = value = this.lookupInlineStyle(element, styleName);
      if (!immediateValue) {
        if (isPlatformBrowser(this._platformId)) {
          if (!inlineOnly) {
            value = getComputedStyle(element).getPropertyValue(styleName);
          }
        } else {
          if (this._serverModuleLoaded) {
            value = this._serverStylesheet.getStyleForElement(element, styleName);
          }
        }
      }
    }

    // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
    //       in which case getComputedStyle() should determine a valid value.
    return value ? value.trim() : '';
  }

  /**
   * Applies the styles to the element. The styles object map may contain an array of values
   * Each value will be added as element style
   * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones
   */
  private _applyMultiValueStyleToElement(styles: StyleDefinition,
                                         element: HTMLElement) {
    Object.keys(styles).sort().forEach(key => {
      const el = styles[key];
      const values: (string | number | null)[] = Array.isArray(el) ? el : [el];
      values.sort();
      for (let value of values) {
        value = value ? value + '' : '';
        if (isPlatformBrowser(this._platformId) || !this._serverModuleLoaded) {
          isPlatformBrowser(this._platformId) ?
            element.style.setProperty(key, value) : this._setServerStyle(element, key, value);
        } else {
          this._serverStylesheet.addStyleToElement(element, key, value);
        }
      }
    });
  }

  private _setServerStyle(element: any, styleName: string, styleValue?: string|null) {
    styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const styleMap = this._readStyleAttribute(element);
    styleMap[styleName] = styleValue || '';
    this._writeStyleAttribute(element, styleMap);
  }

  private _getServerStyle(element: any, styleName: string): string {
    const styleMap = this._readStyleAttribute(element);
    return styleMap[styleName] || '';
  }

  private _readStyleAttribute(element: any): {[name: string]: string} {
    const styleMap: {[name: string]: string} = {};
    const styleAttribute = element.getAttribute('style');
    if (styleAttribute) {
      const styleList = styleAttribute.split(/;+/g);
      for (let i = 0; i < styleList.length; i++) {
        const style = styleList[i].trim();
        if (style.length > 0) {
          const colonIndex = style.indexOf(':');
          if (colonIndex === -1) {
            throw new Error(`Invalid CSS style: ${style}`);
          }
          const name = style.substr(0, colonIndex).trim();
          styleMap[name] = style.substr(colonIndex + 1).trim();
        }
      }
    }
    return styleMap;
  }

  private _writeStyleAttribute(element: any, styleMap: {[name: string]: string}) {
    let styleAttrValue = '';
    for (const key in styleMap) {
      const newValue = styleMap[key];
      if (newValue) {
        styleAttrValue += key + ':' + styleMap[key] + ';';
      }
    }
    element.setAttribute('style', styleAttrValue);
  }
}

/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5})
 */
export type StyleDefinition = { [property: string]: string | number | null };
