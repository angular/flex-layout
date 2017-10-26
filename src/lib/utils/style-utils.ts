/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Renderer2} from '@angular/core';
import {ɵgetDOM as getDom} from '@angular/platform-browser';
import {applyCssPrefixes} from './auto-prefixer';

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
  return getDom().getAttribute(element, attribute) || '';
}
/**
 * Find the DOM element's inline style value (if any)
 */
export function lookupInlineStyle(element: HTMLElement, styleName: string): string {
  return getDom().getStyle(element, styleName);
}

/**
 * Determine the inline or inherited CSS style
 */
export function lookupStyle(element: HTMLElement, styleName: string, inlineOnly = false): string {
  let value = '';
  if (element) {
    try {
      let immediateValue = value = lookupInlineStyle(element, styleName);
      if ( !inlineOnly ) {
        value = immediateValue || getDom().getComputedStyle(element).getPropertyValue(styleName);
      }
    } catch (e) {
      // TODO: platform-server throws an exception for getComputedStyle, will be fixed by PR 18362
    }
  }

  // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
  //       in which case getComputedStyle() should determine a valid value.
  return value ? value.trim() : 'block';
}

