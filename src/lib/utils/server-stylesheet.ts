/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {Injectable} from '@angular/core';
import {StyleDefinition} from './style-utils';
import {applyCssPrefixes} from './auto-prefixer';

@Injectable()
export class ServerStylesheet {

  readonly stylesheet = new Map<HTMLElement, Map<string, string>>();

  constructor() { }

  addStyleToElement(element: any, style: StyleDefinition, value?: string | number) {
    let styles = {};
    if (typeof style === 'string') {
      styles[style] = value;
      style = styles;
    }

    styles = applyCssPrefixes(style);
    this._applyMultiValueStyleToElement(styles, element);
  }

  addStyleToElements(style: StyleDefinition, elements: HTMLElement[]) {
    const styles = applyCssPrefixes(style);
    elements.forEach(el => {
      this._applyMultiValueStyleToElement(styles, el);
    });
  }

  clearStyles() {
    this.stylesheet.clear();
  }

  getStyleForElement(el: HTMLElement, styleName: string): string {
    const styles = this.stylesheet.get(el);
    return styles ? (styles.get(styleName) || '') : '';
  }

  private _applyMultiValueStyleToElement(styles: {}, element: any) {
    Object.keys(styles).sort().forEach(key => {
      const values = Array.isArray(styles[key]) ? styles[key] : [styles[key]];
      values.sort();
      for (let value of values) {
        const stylesheet = this.stylesheet.get(element);
        if (stylesheet) {
          stylesheet.set(key, value);
        } else {
          this.stylesheet.set(element, new Map([[key, value]]));
        }
      }
    });
  }
}
