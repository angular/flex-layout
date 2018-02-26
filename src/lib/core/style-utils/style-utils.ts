/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser, isPlatformServer} from '@angular/common';

import {applyCssPrefixes} from '../../utils/auto-prefixer';
import {ServerStylesheet} from '../server-stylesheet';
import {SERVER_TOKEN} from '../server-token';

@Injectable()
export class StyleUtils {

  constructor(@Optional() private _serverStylesheet: ServerStylesheet,
              @Optional() @Inject(SERVER_TOKEN) private _serverModuleLoaded: boolean,
              @Inject(PLATFORM_ID) private _platformId) {}

  /**
   * Applies styles given via string pair or object map to the directive element
   */
  applyStyleToElement(element: HTMLElement, style: StyleDefinition, value?: string | number) {
    let styles = {};
    if (typeof style === 'string') {
      styles[style] = value;
      style = styles;
    }
    styles = applyCssPrefixes(style);
    this._applyMultiValueStyleToElement(styles, element);
  }

  /**
   * Applies styles given via string pair or object map to the directive's element
   */
  applyStyleToElements(style: StyleDefinition, elements: HTMLElement[] = []) {
    const styles = applyCssPrefixes(style);
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
    if (value === FALLBACK_STYLE) {
      value = '';
    }
    const hasInlineValue = this.lookupInlineStyle(target, query) ||
    (isPlatformServer(this._platformId) && this._serverModuleLoaded) ? value : '';

    return [value || 'row', hasInlineValue];
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
    return element.style[styleName] || element.style.getPropertyValue(styleName);
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
            value = `${this._serverStylesheet.getStyleForElement(element, styleName)}`;
          }
        }
      }
    }

    // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
    //       in which case getComputedStyle() should determine a valid value.
    return value ? value.trim() : FALLBACK_STYLE;
  }

  /**
   * Applies the styles to the element. The styles object map may contain an array of values
   * Each value will be added as element style
   * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones
   */
  private _applyMultiValueStyleToElement(styles: {}, element: HTMLElement) {
    Object.keys(styles).sort().forEach(key => {
      const values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
      values.sort();
      for (let value of values) {
        if (isPlatformBrowser(this._platformId) || !this._serverModuleLoaded) {
          element.style.setProperty(key, value);
        } else {
          this._serverStylesheet.addStyleToElement(element, key, value);
        }
      }
    });
  }
}

/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5})
 */
export type StyleDefinition = { [property: string]: string | number | null };

const FALLBACK_STYLE = 'block';
