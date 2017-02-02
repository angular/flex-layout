/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {__platform_browser_private__} from '@angular/platform-browser';
import {applyCssPrefixes} from '../auto-prefixer';

declare var global: any;

const getDOM = __platform_browser_private__.getDOM;
const _global = <any>(typeof window === 'undefined' ? global : window);

export const expect: (actual: any) => NgMatchers = <any> _global.expect;

/**
 * Jasmine matchers that check Angular specific conditions.
 */
export interface NgMatchers extends jasmine.Matchers {
  /**
   * Expect the element to have exactly the given text.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveText'}
   */
  toHaveText(expected: string): boolean;

  /**
   * Expect the element to have the given CSS class.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveCssClass'}
   */
  toHaveCssClass(expected: string): boolean;

  /**
   * Expect the element to have the given CSS styles.
   *
   * ## Example
   *
   * {@example testing/ts/matchers.ts region='toHaveCssStyle'}
   */
  toHaveCssStyle(expected: {[k: string]: string}|string): boolean;

  /**
   * Invert the matchers.
   */
  not: NgMatchers;
}
/**
 * NOTE: These custom JASMINE Matchers are used only
 *       in the Karma/Jasmine testing for the Layout Directives
 *       in `src/lib/flex/api`
 */
export const customMatchers: jasmine.CustomMatcherFactories = {

  toEqual: function (util) {
    return {
      compare: function (actual: any, expected: any) {
        return {pass: util.equals(actual, expected, [compareMap])};
      }
    };

    function compareMap(actual: any, expected: any) {
      if (actual instanceof Map) {
        let pass = actual.size === expected.size;
        if (pass) {
          actual.forEach((v: any, k: any) => {
            pass = pass && util.equals(v, expected.get(k));
          });
        }
        return pass;
      } else {
        return undefined;
      }
    }
  },

  toHaveText: function () {
    return {
      compare: function (actual: any, expectedText: string) {
        const actualText = elementText(actual);
        return {
          pass: actualText == expectedText,
          get message() {
            return 'Expected ' + actualText + ' to be equal to ' + expectedText;
          }
        };
      }
    };
  },

  toHaveCssClass: function () {
    return {compare: buildError(false), negativeCompare: buildError(true)};

    function buildError(isNot: boolean) {
      return function (actual: any, className: string) {
        return {
          pass: getDOM().hasClass(actual, className) == !isNot,
          get message() {
            return `
              Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}
              to contain the CSS class "${className}"
            `;
          }
        };
      };
    }
  },

  toHaveCssStyle: function () {
    return {
      compare: function (actual: any, styles: {[k: string]: string}|string) {
        let allPassed: boolean;
        if (typeof styles === 'string') {
          allPassed = getDOM().hasStyle(actual, styles);
        } else {
          allPassed = Object.keys(styles).length !== 0;
          Object.keys(styles).forEach(prop => {
            allPassed = allPassed && hasPrefixedStyles(actual, prop, styles[prop]);
          });
        }

        return {
          pass: allPassed,
          get message() {
            const expectedValueStr = typeof styles === 'string' ? styles : JSON.stringify(styles);
            return `
              Expected ${actual.outerHTML} ${!allPassed ? ' ' : 'not '} to contain the
              CSS ${typeof styles === 'string' ? 'property' : 'styles'} "${expectedValueStr}"
            `;
          }
        };
      }
    };
  }

};

/**
 * Validate presence of requested style or use fallback
 * to possible `prefixed` styles. Useful when some browsers
 * (Safari, IE, etc) will use prefixed style instead of defaults.
 */
function hasPrefixedStyles(actual, key, value) {
  let hasStyle = getDOM().hasStyle(actual, key, value.trim());
  if (!hasStyle) {
    let prefixedStyles = applyCssPrefixes({[key]: value});
    Object.keys(prefixedStyles).forEach(prop => {
      // Search for optional prefixed values
      hasStyle = hasStyle || getDOM().hasStyle(actual, prop, prefixedStyles[prop]);
    });
  }
  return hasStyle;
}

function elementText(n: any): string {
  const hasNodes = (m: any) => {
    const children = getDOM().childNodes(m);
    return children && children["length"];
  };

  if (n instanceof Array) {
    return n.map(elementText).join('');
  }

  if (getDOM().isCommentNode(n)) {
    return '';
  }

  if (getDOM().isElementNode(n) && getDOM().tagName(n) == 'CONTENT') {
    return elementText(Array.prototype.slice.apply(getDOM().getDistributedNodes(n)));
  }

  if (getDOM().hasShadowRoot(n)) {
    return elementText(getDOM().childNodesAsList(getDOM().getShadowRoot(n)));
  }

  if (hasNodes(n)) {
    return elementText(getDOM().childNodesAsList(n));
  }

  return getDOM().getText(n);
}

