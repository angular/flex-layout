/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {APP_ROOT_SCOPE, Injectable} from '@angular/core';

/**
 * Utility to emulate a CSS stylesheet
 *
 * This utility class stores all of the styles for a given HTML element
 * as a readonly `stylesheet` map.
 */
@Injectable({scope: APP_ROOT_SCOPE})
export class StylesheetMap {

  readonly stylesheet = new Map<HTMLElement, Map<string, string|number>>();

  /** Add an individual style to an HTML element */
  addStyleToElement(element: HTMLElement, style: string, value: string|number) {
    const stylesheet = this.stylesheet.get(element);
    if (stylesheet) {
      stylesheet.set(style, value);
    } else {
      this.stylesheet.set(element, new Map([[style, value]]));
    }
  }

  /** Clear the virtual stylesheet */
  clearStyles() {
    this.stylesheet.clear();
  }

  /** Retrieve a given style for an HTML element */
  getStyleForElement(el: HTMLElement, styleName: string): string|number {
    const styles = this.stylesheet.get(el);
    return (styles && styles.get(styleName)) || '';
  }
}
