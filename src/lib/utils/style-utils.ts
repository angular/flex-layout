/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Renderer2} from '@angular/core';
import {applyCssPrefixes} from './auto-prefixer';
import {isPlatformBrowser} from '@angular/common';

/**
 * Definition of a css style. Either a property name (e.g. "flex-basis") or an object
 * map of property name and value (e.g. {display: 'none', flex-order: 5}).
 */
export type StyleDefinition = string | { [property: string]: string | number | null };


/**
 * Applies styles given via string pair or object map to the directive element.
 */
export function applyStyleToElement(renderer: Renderer2,
                                    element: any,
                                    style: StyleDefinition,
                                    value?: string | number) {
  let styles = {};
  if (typeof style === 'string') {
    styles[style] = value;
    style = styles;
  }

  styles = applyCssPrefixes(style);
  applyMultiValueStyleToElement(styles, element, renderer);
}


/**
 * Applies styles given via string pair or object map to the directive's element.
 */
export function applyStyleToElements(renderer: Renderer2,
                              style: StyleDefinition,
                              elements: HTMLElement[ ]) {
  let styles = applyCssPrefixes(style);

  elements.forEach(el => {
    applyMultiValueStyleToElement(styles, el, renderer);
  });
}

/**
 * Applies the styles to the element. The styles object map may contain an array of values.
 * Each value will be added as element style.
 * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones.
 */
export function applyMultiValueStyleToElement(styles: {}, element: any, renderer: Renderer2) {
  Object.keys(styles).sort().forEach(key => {
    const values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
    values.sort();
    for (let value of values) {
      renderer.setStyle(element, key, value);
    }
  });
}

/**
 * Find the DOM element's raw attribute value (if any)
 */
export function lookupAttributeValue(element: HTMLElement, attribute: string): string {
  return element.getAttribute(attribute) || '';
}
/**
 * Find the DOM element's inline style value (if any)
 */
export function lookupInlineStyle(element: HTMLElement, styleName: string): string {
  return element.style[styleName];
}

/**
 * Determine the inline or inherited CSS style
 * @TODO(CaerusKaru): platform-server has no implementation for getComputedStyle
 */
export function lookupStyle(_platformId: Object,
                            element: HTMLElement,
                            styleName: string,
                            inlineOnly = false): string {
  let value = '';
  if (element) {
    let immediateValue = value = lookupInlineStyle(element, styleName);
    if (!inlineOnly) {
      value = immediateValue || (isPlatformBrowser(_platformId) &&
        getComputedStyle(element).getPropertyValue(styleName)) || '';
    }
  }

  // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
  //       in which case getComputedStyle() should determine a valid value.
  return value ? value.trim() : 'block';
}

